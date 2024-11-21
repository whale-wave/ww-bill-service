import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from '../../entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity, AssetGroupEntity, AssetRecordEntity, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
