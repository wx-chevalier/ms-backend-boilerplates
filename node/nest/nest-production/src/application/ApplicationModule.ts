import { Module } from '@nestjs/common';
import { HelloController } from './controller/HelloController';
import { GithubSyncController } from '../modules/sync/controller/GithubSyncController';

@Module({
  modules: [],
  controllers: [HelloController, GithubSyncController],
})
export class ApplicationModule {}
