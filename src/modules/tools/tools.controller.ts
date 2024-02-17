import { Controller, Get, Query, Res, Session } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { fail, success } from '../../utils';
import { GetEmailCaptchaDto } from './dto/GetEmailCaptchaDto';
import { ToolsService } from './tools.service';
import { UserService } from '../user/user.service';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(
    private toolsService: ToolsService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '获取图片验证码' })
  @Get('captcha')
  @ApiProduces('image/svg+xml')
  svgCaptcha(
    @Res({ passthrough: true }) res: Response,
    @Session() session: Record<string, any>,
  ) {
    const captcha = this.toolsService.svgCaptcha();
    session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    return captcha.data;
  }

  @ApiOperation({ summary: '获取邮箱验证码' })
  @Get('email')
  async emailCaptcha(
    @Session() session,
    @Query() getEmailCaptchaDto: GetEmailCaptchaDto,
  ) {
    const { email } = getEmailCaptchaDto;

    if (await this.userService.findOneByEmail(email)) {
      return fail('邮箱已经注册');
    }

    const captcha = this.toolsService.svgCaptcha();
    const emailCode = captcha.text.toLowerCase();

    const hasSend = await this.toolsService.emailCaptcha({
      email,
      text: emailCode,
      html: `<h1>${emailCode}</h1>`,
    });

    if (hasSend) {
      session.emailCode = emailCode;
      session.email = email;

      // console.log('layouwen', emailCode, email);

      return success('邮件发送成功');
    } else {
      return fail('邮件发送失败');
    }
  }
}
