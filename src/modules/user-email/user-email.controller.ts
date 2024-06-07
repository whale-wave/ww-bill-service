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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ToolsService } from '../tools/tools.service';
import { RESPONSE_STATUS_CODE, sendError, sendSuccess } from '../../utils';
import { VerifyChangeEmailCaptchaDto } from './dto/verify-change-email-captcha.dto';
import { GetChangeEmailNewEmailCaptchaDto } from './dto/get-change-email-new-email-captcha.dto';
import { PostChangeEmailNewEmailCaptchaDto } from './dto/post-change-email-new-email-captcha.dto';

@Controller('user-email')
@ApiTags('user-email')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
export class UserEmailController {
  constructor(
    private readonly userEmailService: UserEmailService,
    private readonly userService: UserService,
    private readonly toolsService: ToolsService,
  ) {}

  @Get('change-email/captcha')
  @ApiOperation({ summary: '获取修改邮箱验证码' })
  async getChangeEmailCaptcha(@Req() req: any, @Session() session: any) {
    const { email, id: userId } = await this.userService.getUserInfoFullById(
      req.user.id,
    );

    const changeEmailInfo =
      this.userEmailService.getChangeEmailInfoBySession(session);
    if (
      changeEmailInfo &&
      !this.userEmailService.isAllowSendChangeEmailCaptchaBySendTime(
        changeEmailInfo.captchaSendTime,
      )
    ) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.FREQUENT_SENDING,
      });
    }

    const captcha = this.toolsService.svgCaptcha({ size: 6 }).text;
    const isSend = await this.toolsService.emailCaptcha({
      email,
      subject: `鲸浪记账-修改邮箱验证码`,
      text: `验证码: ${captcha}`,
      html: `<h1>验证码: ${captcha}</h1>`,
    });

    if (!isSend) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_SEND_FAIL,
      });
    }

    this.userEmailService.setChangeEmailInfoBySession(
      session,
      {
        userId,
        email,
        captcha,
        captchaSendTime: Date.now(),
      },
      true,
    );

    return sendSuccess({ message: '发送成功' });
  }

  @Get('change-email/verify')
  @ApiOperation({ summary: '验证修改邮箱验证码' })
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
      this.userEmailService.clearChangeEmailInfoBySession(session);

      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED,
      });
    }

    return sendSuccess({ message: '验证成功' });
  }

  @Get('change-email/captcha/new-email')
  @ApiOperation({ summary: '获取修改邮箱验证码' })
  async getChangeEmailNewEmailCaptcha(
    @Session() session: any,
    @Query() getChangeEmailNewEmailCaptchaDto: GetChangeEmailNewEmailCaptchaDto,
  ) {
    const { newEmail: _newEmail, captcha: _captcha } =
      getChangeEmailNewEmailCaptchaDto;
    const newEmail = _newEmail.trim();
    const captcha = _captcha.trim();

    const changeEmailInfo =
      this.userEmailService.getChangeEmailInfoBySession(session);

    if (!changeEmailInfo) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA,
      });
    }

    if (captcha !== changeEmailInfo.captcha) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    if (changeEmailInfo.email === newEmail) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.EMAIL_SAME,
      });
    }

    if (
      changeEmailInfo.captchaSendTime &&
      !this.userEmailService.verifyChangeEmailCaptchaBySendTime(
        changeEmailInfo.captchaSendTime,
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED });
    }

    if (
      changeEmailInfo.newCaptchaSendTime &&
      !this.userEmailService.isAllowSendChangeEmailCaptchaBySendTime(
        changeEmailInfo.newCaptchaSendTime,
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.FREQUENT_SENDING });
    }

    const newCaptcha = this.toolsService.svgCaptcha({ size: 6 }).text;
    const isSend = await this.toolsService.emailCaptcha({
      email: newEmail,
      subject: `鲸浪记账-新邮箱验证码`,
      text: `验证码: ${newCaptcha}`,
      html: `<h1>验证码: ${newCaptcha}</h1>`,
    });

    if (!isSend) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.CAPTCHA_SEND_FAIL,
      });
    }

    this.userEmailService.setChangeEmailInfoBySession(session, {
      newEmailMatchCaptcha: changeEmailInfo.captcha,
      newEmail,
      newCaptcha,
      newCaptchaSendTime: Date.now(),
    });

    return sendSuccess({ message: '发送成功' });
  }

  @Post('change-email')
  @ApiOperation({ summary: '修改邮箱' })
  async changeEmailByCaptcha(
    @Req() req: any,
    @Session() session: any,
    @Query()
    postChangeEmailNewEmailCaptchaDto: PostChangeEmailNewEmailCaptchaDto,
  ) {
    const {
      captcha: _captcha,
      newEmail,
      newCaptcha: _newCaptcha,
    } = postChangeEmailNewEmailCaptchaDto;
    const captcha = _captcha.trim();
    const newCaptcha = _newCaptcha.trim();

    if (!captcha || !newEmail || !newCaptcha) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    const changeEmailInfo =
      this.userEmailService.getChangeEmailInfoBySession(session);

    if (!changeEmailInfo) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA });
    }

    if (!changeEmailInfo.newCaptcha) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_NEW_EMAIL_CAPTCHA,
      });
    }

    if (
      !this.userEmailService.verifyChangeEmailCaptchaBySendTime(
        changeEmailInfo.captchaSendTime,
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED });
    }

    if (
      !this.userEmailService.verifyChangeEmailCaptchaBySendTime(
        changeEmailInfo.newCaptchaSendTime,
      )
    ) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.NEW_CAPTCHA_EXPIRED,
      });
    }

    if (changeEmailInfo.newEmailMatchCaptcha !== captcha) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA });
    }

    if (changeEmailInfo.captcha !== captcha) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    if (changeEmailInfo.newCaptcha !== newCaptcha) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    if (changeEmailInfo.newEmail !== newEmail) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    await this.userService.update(
      {
        id: req.user.id,
      },
      {
        email: newEmail,
      },
    );

    this.userEmailService.clearChangeEmailInfoBySession(session);

    return sendSuccess({ message: '修改成功' });
  }
}
