import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from '../record/record.module';
import { UserEntity } from '../../entity/user.entity';
import { CheckInEntity } from '../../entity/check-in.entity';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInEntity, UserEntity]), RecordModule],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}
