import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [AssetModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
