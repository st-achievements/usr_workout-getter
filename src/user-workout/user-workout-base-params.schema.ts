import { ParamIntSchema } from '@st-api/core';
import { z } from 'zod';

export const UserWorkoutBaseParamsSchema = z.object({
  userId: ParamIntSchema,
});
