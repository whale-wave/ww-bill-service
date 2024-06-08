import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class PostChangeEmailNewEmailCaptchaDto {
  @ApiProperty({ description: '验证码' })
  @IsString({ message: 'captcha 验证码格式不正确' })
  captcha: string;

  @ApiProperty({ description: '新邮箱' })
  @IsEmail({}, { message: 'newEmail 邮箱格式不正确' })
  newEmail: string;

  @ApiProperty({ description: '新邮箱验证码' })
  @IsString({ message: 'newCaptcha 验证码格式不正确' })
  newCaptcha: string;
}
