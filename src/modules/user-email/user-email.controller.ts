import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ToolsService } from '../tools/tools.service';
import { RESPONSE_STATUS_CODE, sendError, sendSuccess } from '../../utils';
import { VerifyChangeEmailCaptchaDto } from './dto/verify-change-email-captcha.dto';

@Controller('user-email')
@ApiTags('user')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
export class UserEmailController {
  constructor(
    private readonly userEmailService: UserEmailService,
    private readonly userService: UserService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('change-email/captcha')
  async getChangeEmailCaptcha(@Req() req: any, @Session() session: any) {
    console.log(req.user, session, 'layouwen');
    const { email, id: userId } = await this.userService.getUserInfoFullById(
      req.user.id,
    );

    const captcha = this.toolsService.svgCaptcha({ size: 6 }).text;
    // const isSend = await this.toolsService.emailCaptcha({
    //   email,
    //   subject: `鲸浪记账-修改邮箱验证码`,
    //   text: `验证码: ${captcha}`,
    //   html: `<h1>验证码: ${captcha}</h1>`,
    // });
    const isSend = true;

    if (!isSend) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_SEND_FAIL,
      });
    }

    this.userEmailService.setChangeEmailInfoBySession(session, {
      userId,
      email,
      captcha,
      captchaSendTime: Date.now(),
    });

    return sendSuccess({ message: '发送成功', data: { session } });
  }

  @Get('change-email/verify')
  async verifyChangeEmailCaptcha(
    @Query() verifyChangeEmailCaptchaDto: VerifyChangeEmailCaptchaDto,
    @Session() session: any,
  ) {
    const { captcha: _captcha } = verifyChangeEmailCaptchaDto;
    const captcha = _captcha.trim();

    if (!captcha) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR,
      });
    }

    const changeEmailInfo =
      this.userEmailService.getChangeEmailInfoBySession(session);

    if (!changeEmailInfo) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA,
      });
    }

    if (changeEmailInfo.captcha !== captcha) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR,
      });
    }

    if (
      !this.userEmailService.verifyChangeEmailCaptchaBySendTime(
        changeEmailInfo.captchaSendTime,
      )
    ) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED,
      });
    }

    return sendSuccess({ message: '验证成功' });
  }

  @Get('change-email/captcha/new-email')
  async getChangeEmailNewEmailCaptcha(@Req() req: any, @Session() session: any) {
    console.log(req.user, session, 'layouwen');
    const { email, id: userId } = await this.userService.getUserInfoFullById(
        req.user.id,
    );

    const captcha = this.toolsService.svgCaptcha({ size: 6 }).text;
    // const isSend = await this.toolsService.emailCaptcha({
    //   email,
    //   subject: `鲸浪记账-修改邮箱验证码`,
    //   text: `验证码: ${captcha}`,
    //   html: `<h1>验证码: ${captcha}</h1>`,
    // });
    const isSend = true;

    if (!isSend) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_SEND_FAIL,
      });
    }

    this.userEmailService.setChangeEmailInfoBySession(session, {
      userId,
      email,
      captcha,
      captchaSendTime: Date.now(),
    });

    return sendSuccess({ message: '发送成功', data: { session } });
  }

  @Post('change-email')
  async changeEmailByCaptcha() {
    return {};
  }
}
