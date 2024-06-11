import { z } from 'zod';

export const UserWorkoutDto = z.object({
  userId: z.number(),
  items: z.array(
    z.object({
      workoutId: z.number(),
      workoutName: z.string(),
      workoutTypeId: z.number(),
      duration: z.number(),
      startedAt: z.string().datetime(),
      endedAt: z.string().datetime(),
      distance: z.number().optional(),
      energyBurned: z.number(),
      periodId: z.number(),
    }),
  ),
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
    limit: z.number(),
    totalRecords: z.number(),
  }),
});

export type UserWorkoutDto = z.input<typeof UserWorkoutDto>;
