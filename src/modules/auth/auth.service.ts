import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  generateNumber,
  throwFail,
  validateNumber,
  validatePassword,
} from '../../utils';
import { UserService } from '../user/user.service';
import { SignDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  login(id: number) {
    return this.usersService.getUserInfo(id);
  }

  async sign(signDto: SignDto) {
    const { password, email } = signDto;
    let { username } = signDto;

    if (username) {
      if (!validateNumber(username)) throwFail('账号必须为数字');

      const userEntry = await this.usersService.findOneByUserName(username);
      if (userEntry) throwFail('账号已经注册');
    } else {
      const genNum = generateNumber(10);
      username = genNum.toString();
      while (await this.usersService.findOneByUserName(username)) {
        username = generateNumber(10).toString();
      }
    }

    if (password && !validatePassword(password)) throwFail('密码必须为8-20位');

    const emailEntry = await this.usersService.findOneByEmail(email);
    if (emailEntry) throwFail('邮箱已经注册');

    const { id } = await this.usersService.create({
      email,
      username,
      password,
    });

    return { token: this.jwtService.sign({ username, id }), id };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createDefaultCategory(userId: string) {
    return this.usersService.createDefaultCategory(userId);
  }
}
