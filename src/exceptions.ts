import { HttpStatus } from '@nestjs/common';
import { exception } from '@st-api/core';

export const WORKOUT_NOT_FOUND = exception({
  status: HttpStatus.NOT_FOUND,
  message: 'Workout not found',
  error: 'Workout not found',
  errorCode: 'USR-WRK-GETTER-0001',
});
