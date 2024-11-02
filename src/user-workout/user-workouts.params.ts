import { ParamIntSchema, safe } from '@st-api/core';
import { z } from 'zod';

import { UserWorkoutBaseParamsSchema } from './user-workout-base-params.schema.js';

export const UserWorkoutsParams = UserWorkoutBaseParamsSchema;
export type UserWorkoutsParams = z.output<typeof UserWorkoutsParams>;

export const UserWorkoutsCursorSchema = z.object({
  workoutId: z.number(),
});

export const UserWorkoutsCursorParam = z
  .string()
  .trim()
  .min(1)
  .max(5000)
  .transform((value) => {
    const [, json] = safe(
      () =>
        JSON.parse(Buffer.from(value, 'base64').toString('utf8')) as unknown,
    );
    return json;
  })
  .pipe(UserWorkoutsCursorSchema)
  .openapi({
    example: Buffer.from(JSON.stringify({ workoutId: 986 })).toString('base64'),
  });

export const UserWorkoutsQueryParams = z.object({
  cursor: UserWorkoutsCursorParam.optional(),
  limit: ParamIntSchema.pipe(z.number().min(1).max(100)).default('10'),
  periodId: ParamIntSchema.pipe(z.number().min(1).safe()).optional(),
  workoutTypeId: ParamIntSchema.pipe(z.number().min(1).safe()).optional(),
});

export type UserWorkoutsQueryParams = z.output<typeof UserWorkoutsQueryParams>;
