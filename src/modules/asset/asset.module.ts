import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from 'src/entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity, AssetGroupEntity, AssetRecordEntity])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
