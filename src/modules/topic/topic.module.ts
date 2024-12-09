import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { FollowModule } from '../follow/follow.module';
import { UserModule } from '../user/user.module';
import { CommentEntity, TopicEntity, TopicLikeEntity, UserEntity } from '../../entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, TopicLikeEntity, UserEntity, CommentEntity]),
    UserModule,
    CheckInModule,
    forwardRef(() => FollowModule),
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
