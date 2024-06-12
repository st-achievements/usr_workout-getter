import { z } from 'zod';

import { UserWorkoutDto } from './user-workout.dto.js';

export const UserWorkoutsPagedDto = z.object({
  userId: z.number().openapi({
    example: 942,
  }),
  items: z.array(UserWorkoutDto),
  metadata: z.object({
    next: z
      .object({
        workoutId: z.number(),
      })
      .transform((next) => Buffer.from(JSON.stringify(next)).toString('base64'))
      .optional()
      .openapi({
        example: Buffer.from(JSON.stringify({ workoutId: 986 })).toString(
          'base64',
        ),
      }),
    hasNext: z.boolean(),
    limit: z.number().openapi({
      example: 10,
      description:
        'Returns the same value as received in the query string parameters',
    }),
    totalRecords: z.number().openapi({
      example: 1000,
      description: 'Total count of records',
    }),
  }),
});

export type UserWorkoutsPagedDto = z.input<typeof UserWorkoutsPagedDto>;
