import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { sendError, sendSuccess } from '../../utils/response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetService } from './asset.service';
import { AdjustAssetDto, CreateAssetDto } from './dto';

@ApiTags('asset')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

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
  async getAssetRecordAll(@Req() req: any) {
    const assetRecordList = await this.assetService.findAssetRecordList(req.user.id);
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

  @ApiOperation({ summary: '获取资产列表' })
  @Get()
  async getAssetList(@Req() req: any) {
    const list = await this.assetService.findAssetList(req.user.id);
    return sendSuccess({ data: list });
  }

  // 删除资产
}
