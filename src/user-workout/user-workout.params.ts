import { ParamIntSchema } from '@st-api/core';

import { UserWorkoutBaseParamsSchema } from './user-workout-base-params.schema.js';
import { z } from 'zod';

export const UserWorkoutParams = UserWorkoutBaseParamsSchema.extend({
  workoutId: ParamIntSchema,
});

export type UserWorkoutParams = z.output<typeof UserWorkoutParams>;
