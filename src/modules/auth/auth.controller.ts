import { Body, Controller, Get, Post, Query, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CaptchaSessionType,
  clearAllCaptchaSessionInfo,
  fail,
  hasCaptchaSessionInfo,
  isAllowSendByCaptchaSendTime,
  isCaptchaExpired,
  isEmailAndCaptchaCorrect,
  setCaptchaSessionInfo,
  success,
  validatePassword,
} from '../../utils';
import { AuthService } from './auth.service';
import {
  LoginDto,
  PostResetPasswordByForgetPasswordCaptchaDto,
  SignDto,
  VerifyEmailCaptchaDto,
} from './dto/auth.dto';
import { GetEmailCaptchaDto } from '../tools/dto/GetEmailCaptchaDto';
import { ToolsService } from '../tools/tools.service';
import { UserService } from '../user/user.service';
import { RESPONSE_STATUS_CODE, sendError, sendSuccess } from '../../utils';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly toolsService: ToolsService,
    private readonly userService: UserService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '登录',
    description: '登录账号',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Session() session) {
    const {
      username: _username,
      password: _password,
      email: _email,
      emailCode: _emailCode,
    } = body;
    const password = _password?.trim();
    const email = _email?.trim();
    const emailCode = _emailCode?.trim();
    const username = _username?.trim();

    let user = null;

    if (username) {
      const captcha = body.captcha?.toLowerCase();
      if (!captcha || session.captcha !== captcha)
        return sendError({ message: '验证码错误' });

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
      return sendError({ message: '参数错误' });
    }

    const userInfo = await this.authService.login(user.id);

    delete session.captcha;
    delete session.loginEmailCode;
    delete session.loginEmail;

    return sendSuccess({
      message: '登录成功',
      data: {
        userInfo,
        token: this.jwtService.sign({
          id: user.id,
          username: user.username,
        }),
      },
    });
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

      return success('验证码发送成功');
    } else {
      return fail('验证码发送失败');
    }
  }

  @ApiOperation({ summary: '忘记密码页面获取邮箱验证码' })
  @Get('forget-password-email')
  async sendForgetPasswordEmailCaptcha(
    @Session() session,
    @Query() getEmailCaptchaDto: GetEmailCaptchaDto,
  ) {
    const { email } = getEmailCaptchaDto;

    if (!(await this.userService.findOneByEmail(email))) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NOT_FOUND_EMAIL });
    }

    if (
      !isAllowSendByCaptchaSendTime(
        session,
        CaptchaSessionType.FORGET_PASSWORD_EMAIL,
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.FREQUENT_SENDING });
    }

    const captcha = this.toolsService
      .svgCaptcha({
        size: 6,
      })
      .text.toLowerCase();

    const hasSend = await this.toolsService.emailCaptcha({
      email,
      subject: `鲸浪记账-忘记密码`,
      text: `验证码: ${captcha}`,
      html: `<h1>验证码: ${captcha}</h1>`,
    });

    if (!hasSend) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.EMAIL_SEND_FAIL });
    }

    setCaptchaSessionInfo(session, CaptchaSessionType.FORGET_PASSWORD_EMAIL, {
      captcha,
      email,
      captchaSendTime: Date.now(),
    });

    return sendSuccess({ message: '验证码发送成功' });
  }

  @ApiOperation({ summary: '校验忘记密码验证码是否有效' })
  @Get('forget-password-email/verify-code')
  async verifyForgetPasswordEmailCaptcha(
    @Session() session,
    @Query() verifyEmailCaptchaDto: VerifyEmailCaptchaDto,
  ) {
    const { captcha, email } = verifyEmailCaptchaDto;

    if (
      !hasCaptchaSessionInfo(session, CaptchaSessionType.FORGET_PASSWORD_EMAIL)
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA });
    }

    if (
      !isEmailAndCaptchaCorrect(
        session,
        CaptchaSessionType.FORGET_PASSWORD_EMAIL,
        {
          email,
          captcha,
        },
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    if (isCaptchaExpired(session, CaptchaSessionType.FORGET_PASSWORD_EMAIL)) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED });
    }

    return sendSuccess({ message: '验证码正确' });
  }

  @ApiOperation({ summary: '通过忘记密码的邮箱验证码重置密码' })
  @Post('password/forget/reset')
  async resetPasswordByForgetPasswordCaptcha(
    @Session() session,
    @Body()
    postResetPasswordByForgetPasswordCaptchaDto: PostResetPasswordByForgetPasswordCaptchaDto,
  ) {
    const {
      email: _email,
      captcha: _captcha,
      password: _password,
      confirmPassword: _confirmPassword,
    } = postResetPasswordByForgetPasswordCaptchaDto;
    const password = _password.trim();
    const confirmPassword = _confirmPassword.trim();
    const captcha = _captcha.trim().toLowerCase();
    const email = _email.trim();

    if (
      !hasCaptchaSessionInfo(session, CaptchaSessionType.FORGET_PASSWORD_EMAIL)
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PLEASE_GET_CAPTCHA });
    }

    if (
      !isEmailAndCaptchaCorrect(
        session,
        CaptchaSessionType.FORGET_PASSWORD_EMAIL,
        {
          email,
          captcha,
        },
      )
    ) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_ERROR });
    }

    if (isCaptchaExpired(session, CaptchaSessionType.FORGET_PASSWORD_EMAIL)) {
      clearAllCaptchaSessionInfo(
        session,
        CaptchaSessionType.FORGET_PASSWORD_EMAIL,
      );
      return sendError({ statusCode: RESPONSE_STATUS_CODE.CAPTCHA_EXPIRED });
    }

    if (!password || !confirmPassword) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PASSWORD_EMPTY });
    }

    if (password !== confirmPassword) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.PASSWORD_NOT_SAME });
    }

    if (!validatePassword(password)) {
      return sendError({
        statusCode: RESPONSE_STATUS_CODE.PASSWORD_INVALID,
        message: '密码必须为8-20位',
      });
    }

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NOT_FOUND_EMAIL });
    }

    await this.authService.resetPasswordByEmail(email, password);

    clearAllCaptchaSessionInfo(
      session,
      CaptchaSessionType.FORGET_PASSWORD_EMAIL,
    );

    return sendSuccess({ message: '密码重置成功' });
  }
}
