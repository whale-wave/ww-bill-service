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
import {
  clearAllForgetEmailSessionInfo,
  fail,
  isForgetEmailCaptchaExpired,
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
// import { LocalAuthGuard } from './local-auth.guard';
import { GetEmailCaptchaDto } from '../tools/dto/GetEmailCaptchaDto';
import { ToolsService } from '../tools/tools.service';
import { UserService } from '../user/user.service';
import { FORGET_PASSWORD_EMAIL_CODE_TIMEOUT_TIME } from '../../constant';

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

    if (isForgetEmailCaptchaExpired(session)) {
      clearAllForgetEmailSessionInfo(session);
      return fail('验证码已过期');
    }

    if (
      captcha !== session.forgetPasswordEmailCode ||
      email !== session.forgetPasswordEmail
    ) {
      return fail('验证码错误');
    }

    if (!password || !confirmPassword) {
      return fail('密码不能为空');
    }

    if (password !== confirmPassword) {
      return fail('两次密码不一致');
    }

    if (!validatePassword(password)) {
      return fail('密码必须为8-20位');
    }

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return fail('邮箱未注册');
    }

    await this.authService.resetPasswordByEmail(email, password);

    clearAllForgetEmailSessionInfo(session);

    return success('重置密码成功');
  }

  @ApiOperation({ summary: '忘记密码页面获取邮箱验证码' })
  @Get('forget-password-email')
  async sendForgetPasswordEmailCaptcha(
    @Session() session,
    @Query() getEmailCaptchaDto: GetEmailCaptchaDto,
  ) {
    const { email } = getEmailCaptchaDto;

    if (!(await this.userService.findOneByEmail(email))) {
      return fail('邮箱未注册');
    }

    if (
      session.forgetPasswordEmailCodeSendTime &&
      Date.now() - session.forgetPasswordEmailCodeSendTime <
        FORGET_PASSWORD_EMAIL_CODE_TIMEOUT_TIME
    ) {
      return fail('验证码发送频繁，请稍后再试');
    } else {
      delete session.forgetPasswordEmailCode;
      delete session.forgetPasswordEmail;
      delete session.forgetPasswordEmailCodeSendTime;
    }

    const captcha = this.toolsService.svgCaptcha({
      size: 6,
    });
    const emailCode = captcha.text.toLowerCase();

    const hasSend = await this.toolsService.emailCaptcha({
      email,
      subject: `鲸浪记账-忘记密码`,
      text: `验证码: ${emailCode}`,
      html: `<h1>验证码: ${emailCode}</h1>`,
    });

    if (hasSend) {
      session.forgetPasswordEmailCode = emailCode;
      session.forgetPasswordEmail = email;
      session.forgetPasswordEmailCodeSendTime = Date.now();

      console.log('layouwen forget password email code', emailCode, email);

      return success('验证码发送成功');
    } else {
      return fail('验证码发送失败');
    }
  }

  @ApiOperation({ summary: '校验忘记密码验证码是否有效' })
  @Get('forget-password-email/verify-code')
  async verifyForgetPasswordEmailCaptcha(
    @Session() session,
    @Query() verifyEmailCaptchaDto: VerifyEmailCaptchaDto,
  ) {
    const { captcha, email } = verifyEmailCaptchaDto;
    const { forgetPasswordEmailCode, forgetPasswordEmail } = session;

    if (
      forgetPasswordEmailCode &&
      forgetPasswordEmail &&
      forgetPasswordEmailCode === captcha &&
      forgetPasswordEmail === email
    ) {
      return success('验证码正确');
    } else {
      return fail('验证码错误');
    }
  }
}
