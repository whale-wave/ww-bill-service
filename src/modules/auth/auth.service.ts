import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import {
  generateNumber,
  throwFail,
  validateNumber,
  validatePassword,
} from '../../utils';
import { UserService } from '../user/user.service';
import { UserAppConfigService } from '../user-app-config/user-app-config.service';
import { SignDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private userAppConfigService: UserAppConfigService,
  ) {}

  login(id: number) {
    return this.usersService.getUserInfo(id);
  }

  async sign(signDto: SignDto) {
    const { password, email } = signDto;
    let { username } = signDto;

    if (username) {
      if (!validateNumber(username))
        throwFail('账号必须为数字');

      const userEntry = await this.usersService.findOneByUserName(username);
      if (userEntry)
        throwFail('账号已经注册');
    }
    else {
      const genNum = generateNumber(10);
      username = genNum.toString();
      while (await this.usersService.findOneByUserName(username)) {
        username = generateNumber(10).toString();
      }
    }

    if (password && !validatePassword(password))
      throwFail('密码必须为8-20位');

    const emailEntry = await this.usersService.findOneByEmail(email);
    if (emailEntry)
      throwFail('邮箱已经注册');

    const user = await this.usersService.create({
      email,
      username,
      password,
    });
    const { id } = user;

    await this.userAppConfigService.create({ user });

    return { token: this.jwtService.sign({ username, id }), id };
  }

  async _validateUserByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByUsernameEmailAndPassword(
    username: string,
    password: string,
  ): Promise<any> {
    let user = null;

    if (isEmail(username)) {
      user = await this.usersService.findOneByEmail(username);
    }
    else {
      user = await this.usersService.findOneByUserName(username);
    }

    if (!user || user.password !== password) {
      throwFail('账号或密码错误');
    }

    const { password: _, ...result } = user;

    return result;
  }

  async validateUserByEmailAndEmailCode(
    email: string,
    emailCode?: string,
    correctEmailCode?: string,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throwFail('邮箱未注册');
    }

    if (!correctEmailCode || !emailCode || emailCode !== correctEmailCode) {
      throwFail('验证码错误');
    }

    const { password: _, ...result } = user;

    return result;
  }

  async createDefaultCategory(userId: string) {
    return this.usersService.createDefaultCategory(userId);
  }

  resetPasswordByEmail(email: string, password: string) {
    return this.usersService.updatePasswordByEmail(email, password);
  }
}
