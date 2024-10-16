import 'reflect-metadata';
import { AchievementsCoreAdapter } from '@st-achievements/core';
import { StFirebaseApp } from '@st-api/firebase';
import { GetWorkoutsController } from './user-workout/get-workouts.controller.js';
import { GetWorkoutController } from './user-workout/get-workout.controller.js';

const app = StFirebaseApp.create({
  adapter: new AchievementsCoreAdapter({
    throttling: true,
    authentication: true,
  }),
  controllers: [GetWorkoutsController, GetWorkoutController],
}).withHttpHandler();

export const usr_workout = {
  getter: {
    http: app.getHttpHandler(),
  },
};
