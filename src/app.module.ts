import { Module } from '@nestjs/common';
import { AchievementsCoreModule } from '@st-achievements/core';
import { CoreModule } from '@st-api/core';

import { AppController } from './app.controller.js';

@Module({
  imports: [
    CoreModule.forRoot(),
    AchievementsCoreModule.forRoot({
      throttling: true,
      authentication: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
