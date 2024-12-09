import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SystemNotifyEntity } from '../../entity';
import { SystemNotifyController } from './system-notify.controller';
import { SystemNotifyService } from './system-notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemNotifyEntity]), UserModule],
  providers: [SystemNotifyService],
  controllers: [SystemNotifyController],
  exports: [SystemNotifyService],
})
export class SystemNotifyModule {}
