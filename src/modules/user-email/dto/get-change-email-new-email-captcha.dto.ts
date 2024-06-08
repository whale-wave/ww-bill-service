import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class GetChangeEmailNewEmailCaptchaDto {
  @ApiProperty({ description: '验证码' })
  @IsString({ message: '验证码格式不正确' })
  captcha: string;

  @ApiProperty({ description: '新邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  newEmail: string;
}
