import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssertAuthUser } from '@st-achievements/core';
import { Drizzle, usr } from '@st-achievements/database';
import { Exceptions, ZParams, ZQuery, ZRes } from '@st-api/core';
import { Logger } from '@st-api/firebase';
import { and, count, desc, eq, lte, SQL } from 'drizzle-orm';

import { WORKOUT_NOT_FOUND } from '../exceptions.js';

import { UserWorkoutDto } from './user-workout.dto.js';
import { UserWorkoutParams } from './user-workout.params.js';
import { UserWorkoutsPagedDto } from './user-workouts-paged.dto.js';
import {
  UserWorkoutsParams,
  UserWorkoutsQueryParams,
} from './user-workouts.params.js';

@ApiTags('User Workouts')
@AssertAuthUser()
@Controller({
  version: '1',
  path: 'users/:userId/workouts',
})
export class UserWorkoutController {
  constructor(private readonly drizzle: Drizzle) {}

  private readonly logger = Logger.create(this);

  @Exceptions([WORKOUT_NOT_FOUND])
  @ZRes(UserWorkoutDto)
  @Get(':workoutId')
  async getWorkout(
    @ZParams() { userId, workoutId }: UserWorkoutParams,
  ): Promise<UserWorkoutDto> {
    const entity = await this.drizzle.query.usrWorkout.findFirst({
      columns: {
        id: true,
        workoutName: true,
        periodId: true,
        distance: true,
        duration: true,
        endedAt: true,
        energyBurned: true,
        startedAt: true,
        workoutTypeId: true,
      },
      with: {
        wrkWorkoutType: {
          columns: {
            name: true,
          },
        },
      },
      where: and(eq(usr.workout.userId, userId), eq(usr.workout.id, workoutId)),
    });
    if (!entity) {
      throw WORKOUT_NOT_FOUND();
    }
    return {
      workoutId: entity.id,
      workoutName: entity.workoutName ?? entity.wrkWorkoutType.name,
      distance: entity.distance ?? undefined,
      duration: entity.duration,
      endedAt: entity.endedAt.toISOString(),
      energyBurned: entity.energyBurned,
      periodId: entity.periodId,
      startedAt: entity.startedAt.toISOString(),
      workoutTypeId: entity.workoutTypeId,
    };
  }

  @ZRes(UserWorkoutsPagedDto)
  @Get()
  async getWorkouts(
    @ZParams() { userId }: UserWorkoutsParams,
    @ZQuery() { limit, cursor }: UserWorkoutsQueryParams,
  ): Promise<UserWorkoutsPagedDto> {
    const where: SQL[] = [eq(usr.workout.userId, userId)];
    const [entities, [countResult]] = await Promise.all([
      this.drizzle.query.usrWorkout.findMany({
        columns: {
          id: true,
          workoutName: true,
          periodId: true,
          distance: true,
          duration: true,
          endedAt: true,
          energyBurned: true,
          startedAt: true,
          workoutTypeId: true,
        },
        with: {
          wrkWorkoutType: {
            columns: {
              name: true,
            },
          },
        },
        limit: limit + 1,
        where: and(
          ...where,
          lte(usr.workout.id, cursor?.workoutId ?? Number.MAX_SAFE_INTEGER).if(
            cursor,
          ),
        ),
        orderBy: desc(usr.workout.id),
      }),
      this.drizzle
        .select({ count: count() })
        .from(usr.workout)
        .where(and(...where)),
    ]);
    this.logger.info(
      `Entities = ${entities.length} - Count - ${countResult?.count}`,
    );
    const hasNext = entities.length > limit;
    const nextId = hasNext ? entities.pop()?.id : undefined;
    return {
      userId,
      items: entities.map((entity) => ({
        workoutId: entity.id,
        workoutName: entity.workoutName ?? entity.wrkWorkoutType.name,
        distance: entity.distance ?? undefined,
        duration: entity.duration,
        endedAt: entity.endedAt.toISOString(),
        energyBurned: entity.energyBurned,
        periodId: entity.periodId,
        startedAt: entity.startedAt.toISOString(),
        workoutTypeId: entity.workoutTypeId,
      })),
      metadata: {
        hasNext,
        next: hasNext && nextId ? { workoutId: nextId } : undefined,
        totalRecords: countResult?.count ?? 0,
        limit,
      },
    };
  }
}
