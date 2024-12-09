import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInModule } from '../check-in/check-in.module';
import { RecordModule } from '../record/record.module';
import { AssetModule } from '../asset/asset.module';
import { UserEntity } from '../../entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CheckInModule, RecordModule, forwardRef(() => AssetModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
