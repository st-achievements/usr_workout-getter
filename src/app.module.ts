import { Module } from '@nestjs/common';
import { AchievementsCoreModule } from '@st-achievements/core';
import { CoreModule } from '@st-api/core';

import { UserWorkoutController } from './user-workout/user-workout.controller.js';

@Module({
  imports: [
    CoreModule.forRoot(),
    AchievementsCoreModule.forRoot({
      throttling: true,
      authentication: true,
    }),
  ],
  controllers: [UserWorkoutController],
})
export class AppModule {}
