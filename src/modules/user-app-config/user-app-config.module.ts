import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAppConfig } from '../../entity/UserAppConfig.entity';
import { UserAppConfigService } from './user-app-config.service';
import { UserAppConfigController } from './user-app-config.controller';

@Module({
  controllers: [UserAppConfigController],
  providers: [UserAppConfigService],
  exports: [UserAppConfigService],
  imports: [TypeOrmModule.forFeature([UserAppConfig])],
})
export class UserAppConfigModule {
}
