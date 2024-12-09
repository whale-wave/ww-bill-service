import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from '../topic/topic.module';
import { UserModule } from '../user/user.module';
import { FollowEntity } from '../../entity/follow.entity';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowEntity]),
    UserModule,
    forwardRef(() => TopicModule),
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
