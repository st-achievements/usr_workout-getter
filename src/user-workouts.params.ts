import { ParamIntSchema, safe, zDto } from '@st-api/core';
import { z } from 'zod';

export class UserWorkoutsParams extends zDto(
  z.object({
    userId: ParamIntSchema,
  }),
) {}

export const UserWorkoutCursorSchema = z.object({
  workoutId: z.number(),
});

export const UserWorkoutCursorParam = z
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
  .pipe(UserWorkoutCursorSchema)
  .openapi({
    example: Buffer.from(JSON.stringify({ workoutId: 986 })).toString('base64'),
  });

export class UserWorkoutQueryParams extends zDto(
  z.object({
    cursor: UserWorkoutCursorParam.optional(),
    limit: ParamIntSchema.pipe(z.number().min(1).max(100)).default('10'),
  }),
) {}
