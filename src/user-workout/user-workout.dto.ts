import { z } from 'zod';

export const UserWorkoutDto = z.object({
  workoutId: z.number().openapi({
    example: 5,
  }),
  workoutName: z.string().openapi({
    example: 'Traditional Strength Training',
  }),
  workoutTypeId: z.number().openapi({
    example: 20,
  }),
  duration: z.number().openapi({
    example: 50.9,
    description: 'Duration in minutes',
  }),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
  distance: z.number().optional(),
  energyBurned: z.number().openapi({
    example: 257,
    description: 'Total KCAL burned in the workout',
  }),
  periodId: z.number().openapi({
    example: 1,
  }),
});

export type UserWorkoutDto = z.input<typeof UserWorkoutDto>;
