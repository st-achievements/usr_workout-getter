import { AssertAuthUser } from '@st-achievements/core';
import { Drizzle, usr } from '@st-achievements/database';
import { Controller, Exceptions, Handler, ZParams, ZRes } from '@st-api/core';
import { and, eq } from 'drizzle-orm';

import { WORKOUT_NOT_FOUND } from '../exceptions.js';

import { UserWorkoutDto } from './user-workout.dto.js';
import { UserWorkoutParams } from './user-workout.params.js';

@AssertAuthUser()
@Exceptions([WORKOUT_NOT_FOUND])
@ZRes(UserWorkoutDto)
@Controller({
  path: 'v1/users/:userId/workouts/:workoutId',
  openapi: {
    tags: ['User Workouts'],
    responses: {},
  },
})
export class GetWorkoutController implements Handler {
  constructor(private readonly drizzle: Drizzle) {}

  async handle(
    @ZParams(UserWorkoutParams) { userId, workoutId }: UserWorkoutParams,
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
}
