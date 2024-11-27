import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetStatisticalRecord } from 'src/entity/asset-statistical-record.entity';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from '../../entity';
import { UserModule } from '../user/user.module';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity, AssetGroupEntity, AssetRecordEntity, AssetStatisticalRecord]),
    forwardRef(() => UserModule),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
