import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RESPONSE_STATUS_CODE, removeUndefinedField, sendError, sendSuccess } from '../../utils';
import { UserAppConfigService } from './user-app-config.service';
import { UpdateUserAppConfigByUserIdDto } from './dto/UpdateUserAppConfigByUserIdDto';

@ApiTags('user-app-config')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@Controller('user-app-config')
export class UserAppConfigController {
  constructor(private readonly userAppConfigService: UserAppConfigService) {
  }

  @ApiOperation({ summary: '获取用户配置' })
  @Get()
  async getUserAppConfigByUserId(@Req() req: any) {
    const userAppConfig = await this.userAppConfigService.findOne({ where: { user: req.user.id } });

    return sendSuccess({
      data: userAppConfig,
    });
  }

  @ApiOperation({ summary: '更新用户配置' })
  @Patch()
  async updateUserAppConfigByUserId(@Req() req: any, @Body() updateUserAppConfigByUserIdDto: UpdateUserAppConfigByUserIdDto) {
    const { isOpenSoundEffect, isDisplayAmount, isDisplayAmountSwitch } = updateUserAppConfigByUserIdDto;
    const updateData = removeUndefinedField({
      isDisplayAmount,
      isDisplayAmountSwitch,
      isOpenSoundEffect,
    });

    if (Object.keys(updateData).length === 0) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.NO_VALID_PARAMETER,
      });
    }

    await this.userAppConfigService.update({ user: req.user.id }, updateData);

    return sendSuccess({
      message: '更新成功',
    });
  }
}
