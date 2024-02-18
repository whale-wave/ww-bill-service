import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  // UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fail, success } from '../../utils';
import { AuthService } from './auth.service';
import { LoginDto, SignDto } from './dto/auth.dto';
// import { LocalAuthGuard } from './local-auth.guard';
import { GetEmailCaptchaDto } from '../tools/dto/GetEmailCaptchaDto';
import { ToolsService } from '../tools/tools.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly toolsService: ToolsService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '登录',
    description: '登录账号',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Session() session) {
    const { username, password, email, emailCode } = body;
    let user = null;

    if (username) {
      const captcha = body.captcha.toLowerCase();
      if (!captcha || session.captcha !== captcha) return fail('验证码错误');

      user = await this.authService.validateUserByUsernameEmailAndPassword(
        username,
        password,
      );
    } else if (email) {
      user = await this.authService.validateUserByEmailAndEmailCode(
        email,
        emailCode,
        session.loginEmailCode,
      );
    } else {
      return fail('参数错误');
    }

    const userInfo = await this.authService.login(user.id);

    delete session.captcha;
    delete session.loginEmailCode;
    delete session.loginEmail;

    return success(
      {
        userInfo,
        token: this.jwtService.sign({
          id: user.id,
          username: user.username,
        }),
      },
      '登录成功',
    );
  }

  @Post('sign')
  @ApiOperation({ summary: '注册' })
  async sign(@Body() signDto: SignDto, @Session() session) {
    const emailCode = signDto.emailCode.toLowerCase();
    if (
      !emailCode ||
      session.emailCode !== emailCode ||
      signDto.email !== session.email
    )
      return fail('验证码错误');

    const data = await this.authService.sign(signDto);

    delete signDto.email;
    delete session.emailCode;

    await this.authService.createDefaultCategory(data.id + '');

    return success(data, '注册成功');
  }

  @ApiOperation({ summary: '获取邮箱验证码' })
  @Get('login/email/captcha')
  async loginEmailCaptcha(
    @Session() session,
    @Query() getEmailCaptchaDto: GetEmailCaptchaDto,
  ) {
    const { email } = getEmailCaptchaDto;

    delete session.loginEmailCode;
    delete session.loginEmail;

    const captcha = this.toolsService.svgCaptcha();
    const emailCode = captcha.text.toLowerCase();

    const hasSend = await this.toolsService.emailCaptcha({
      email,
      text: emailCode,
      html: `<h1>登录验证码为: ${emailCode}</h1>`,
    });

    if (hasSend) {
      session.loginEmailCode = emailCode;
      session.loginEmail = email;

      // console.log('layouwen', emailCode, email);

      return success('验证码发送成功');
    } else {
      return fail('验证码发送失败');
    }
  }
}
