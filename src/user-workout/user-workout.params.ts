import { ParamIntSchema, zDto } from '@st-api/core';

import { UserWorkoutBaseParamsSchema } from './user-workout-base-params.schema.js';

export class UserWorkoutParams extends zDto(
  UserWorkoutBaseParamsSchema.extend({
    workoutId: ParamIntSchema,
  }),
) {}
