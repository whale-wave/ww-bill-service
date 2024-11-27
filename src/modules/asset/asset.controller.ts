import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { Between, FindConditions } from 'typeorm';
import { sendError, sendSuccess } from '../../utils/response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetRecordEntity } from '../../entity';
import { AssetService } from './asset.service';
import { AdjustAssetDto, CreateAssetDto, GetAssetRecordQueryDto, GetAssetStatisticalRecordQueryDto } from './dto';

@ApiTags('asset')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiOperation({ summary: '获取资产统计记录列表' })
  @Get('statistical')
  async getAssetStatisticalRecord(@Req() req: any, @Query() getAssetStatisticalRecordQueryDto: GetAssetStatisticalRecordQueryDto) {
    const { type, startTime, endTime } = getAssetStatisticalRecordQueryDto;
    const statisticalRecord = await this.assetService.getAssetStatisticalRecordList(req.user.id, {
      type,
      createdAt: Between(new Date(Number(startTime)), new Date(Number(endTime))),
    });

    return sendSuccess({ data: statisticalRecord });
  }

  @ApiOperation({ summary: '获取资产分组详情' })
  @Get('group/:assetGroupId')
  async getAssetGroup(@Req() req: any, @Param('assetGroupId') assetGroupId: string) {
    const assetGroup = await this.assetService.getAssetGroup(req.user.id, assetGroupId);
    return sendSuccess({ data: assetGroup });
  }

  @ApiOperation({ summary: '获取资产分组列表' })
  @Get('group')
  async getAssetGroupList() {
    const assetGroupList = await this.assetService.getAssetGroupList();
    return sendSuccess({
      data: assetGroupList,
    });
  }

  @ApiOperation({ summary: '获取资产记录详情' })
  @Get('/record/:assetRecordId')
  async getAssetRecord(
    @Req() req: any,
    @Param('assetRecordId') assetRecordId: string,
  ) {
    const assetRecord = await this.assetService.findOneAssetRecord(
      req.user.id,
      assetRecordId,
    );

    if (!assetRecord) {
      return sendError({ message: '资产记录不存在' });
    }

    return sendSuccess({ data: assetRecord });
  }

  @ApiOperation({ summary: '获取资产记录列表' })
  @Get('/record')
  async getAssetRecordAll(@Req() req: any, @Query() getAssetRecordQueryDto: GetAssetRecordQueryDto) {
    const { startTime, endTime, assetId } = getAssetRecordQueryDto;
    const findConditions: FindConditions<AssetRecordEntity> = { asset: { id: assetId } };

    if (startTime && endTime) {
      findConditions.createdAt = Between(new Date(Number(startTime)), new Date(Number(endTime)));
    }

    const assetRecordList = await this.assetService.findAssetRecordList(req.user.id, findConditions);
    return sendSuccess({ data: assetRecordList });
  }

  @ApiOperation({ summary: '调整资产' })
  @Patch('adjust/:assetId')
  async adjustAssetRecord(
    @Req() req: any,
    @Param('assetId') assetId: string,
    @Body() adjustAsset: AdjustAssetDto,
  ) {
    if (isEmpty(adjustAsset)) {
      return sendError({ message: '参数不能为空' });
    }

    await this.assetService.adjustAsset(
      req.user.id,
      assetId,
      adjustAsset,
    );
    return sendSuccess();
  }

  @ApiOperation({ summary: '创建资产' })
  @Post()
  async createAsset(@Req() req: any, @Body() createAssetDto: CreateAssetDto) {
    await this.assetService.createAsset(req.user.id, createAssetDto);
    return sendSuccess();
  }

  @ApiOperation({ summary: '获取资产详情' })
  @Get(':assetId')
  async getAsset(@Req() req: any, @Param('assetId') assetId: string) {
    const asset = await this.assetService.findOneAsset(req.user.id, assetId);
    return sendSuccess({ data: asset });
  }

  @ApiOperation({ summary: '获取资产列表' })
  @Get()
  async getAssetList(@Req() req: any) {
    const list = await this.assetService.findAssetList(req.user.id);
    return sendSuccess({ data: list });
  }

  @ApiOperation({ summary: '删除资产' })
  @Delete(':assetId')
  async deleteAsset(@Req() req: any, @Param('assetId') assetId: string) {
    await this.assetService.deleteAsset(req.user.id, assetId);
    return sendSuccess();
  }

  // 删除资产
}
