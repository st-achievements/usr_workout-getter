import { ParamIntSchema, safe, zDto } from '@st-api/core';
import { z } from 'zod';

import { UserWorkoutBaseParamsSchema } from './user-workout-base-params.schema.js';

export class UserWorkoutsParams extends zDto(UserWorkoutBaseParamsSchema) {}

export const UserWorkoutsCursorSchema = z.object({
  workoutId: z.number(),
});

export const UserWorkoutsCursorParam = z
  .string()
  .trim()
  .min(1)
  .max(5000)
  .transform((value) => {
    const [, json] = safe(() =>
      JSON.parse(Buffer.from(value, 'base64').toString('utf8')),
    );
    return json;
  })
  .pipe(UserWorkoutsCursorSchema)
  .openapi({
    example: Buffer.from(JSON.stringify({ workoutId: 986 })).toString('base64'),
  });

export class UserWorkoutsQueryParams extends zDto(
  z.object({
    cursor: UserWorkoutsCursorParam.optional(),
    limit: ParamIntSchema.pipe(z.number().min(1).max(100)).default('10'),
  }),
) {}
