import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class TaskService {
  constructor(private readonly assetService: AssetService) {}

  @Cron('0 1 * * *')
  async updateUserStatisticalRecord() {
    this.assetService.updateAssetStatisticalRecordAllUser();
  }
}
