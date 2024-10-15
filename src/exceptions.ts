import { exception } from '@st-api/core';
import { StatusCodes } from 'http-status-codes';

export const WORKOUT_NOT_FOUND = exception({
  status: StatusCodes.NOT_FOUND,
  message: 'Workout not found',
  error: 'Workout not found',
  errorCode: 'USR-WRK-GETTER-0001',
});
