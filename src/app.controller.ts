import { Controller, Get } from '@nestjs/common';
import { Drizzle, usr } from '@st-achievements/database';
import { ZParams, ZQuery, ZRes } from '@st-api/core';
import { Logger } from '@st-api/firebase';
import { and, count, desc, eq, lte, SQL } from 'drizzle-orm';

import { UserWorkoutDto } from './user-workout.dto.js';
import {
  UserWorkoutQueryParams,
  UserWorkoutsParams,
} from './user-workouts.params.js';

@Controller({
  version: '1',
  path: 'users/:userId/workouts',
})
export class AppController {
  constructor(private readonly drizzle: Drizzle) {}

  private readonly logger = Logger.create(this);

  @ZRes(UserWorkoutDto)
  @Get()
  async get(
    @ZParams() { userId }: UserWorkoutsParams,
    @ZQuery() { limit, cursor }: UserWorkoutQueryParams,
  ): Promise<UserWorkoutDto> {
    const where: SQL[] = [eq(usr.workout.userId, userId)];
    const [entities, [countResult]] = await Promise.all([
      this.drizzle.query.usrWorkout.findMany({
        with: {
          wrkWorkoutType: true,
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
