import {
  AchievementsCoreAdapter,
  REDIS_CREDENTIALS,
} from '@st-achievements/core';
import { StFirebaseApp } from '@st-api/firebase';

import { AppModule } from './app.module.js';

const app = StFirebaseApp.create(AppModule, {
  adapter: new AchievementsCoreAdapter(),
  secrets: [REDIS_CREDENTIALS],
}).withHttpHandler();

export const usr_workout = {
  list: {
    getter: {
      http: app.getHttpHandler(),
    },
  },
};
