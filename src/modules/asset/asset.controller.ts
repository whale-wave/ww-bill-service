import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sendSuccess } from '../../utils/response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetService } from './asset.service';

@ApiTags('asset')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  // 获取资产列表

  // 获取资产详情

  // 获取资产记录列表
  @ApiOperation({ summary: '获取资产分组列表' })
  @Get('group')
  async getAssetGroupList() {
    const assetGroupList = await this.assetService.getAssetGroupList();
    return sendSuccess({
      data: assetGroupList,
    });
  }

  // 获取资产分组列表

  // 创建资产
  @Post()
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.createAsset(createAssetDto);
  }

  // 更新资产

  // 删除资产

  // @Post()
  // create(@Body() createAssetDto: CreateAssetDto) {
  //   return this.assetService.create(createAssetDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.assetService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetService.update(+id, updateAssetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.assetService.remove(+id);
  // }
}
