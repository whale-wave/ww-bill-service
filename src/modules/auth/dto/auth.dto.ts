import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignDto {
  @IsNumberString({}, { message: '账号需为纯数字' })
  @IsOptional()
  @ApiPropertyOptional({
    description: '账号',
    type: 'string',
    example: '794234293',
  })
  username?: string;

  @IsString({ message: '邮箱需为字符串' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({
    description: '邮箱',
    type: 'string',
    example: 'layouwen@gmail.com',
  })
  email: string;

  @IsString({ message: '用户名需为字符串' })
  @IsOptional()
  @ApiPropertyOptional({
    description: '用户名',
    type: 'string',
    example: '神奇海螺',
  })
  name?: string;

  @IsNotEmpty({ message: '请输入密码' })
  @IsString({ message: '密码需为字符串' })
  @ApiProperty({
    description: '密码',
    type: 'string',
    example: 'layouwen',
  })
  password: string;

  @IsNotEmpty({ message: '请输入验证码' })
  @IsString({ message: '验证码需为字符串' })
  @ApiProperty({
    description: '邮箱验证码',
    type: 'string',
    example: '33nd',
  })
  emailCode: string;
}

export class LoginDto extends OmitType(SignDto, [
  'name',
  'email',
  'emailCode',
]) {
  @ApiProperty({ description: '验证码', type: 'string', example: '923a' })
  @IsString({ message: '验证码需为字符串' })
  @IsNotEmpty({ message: '请输入验证码' })
  captcha: string;
}
