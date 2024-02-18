import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isEmail,
  registerDecorator,
} from 'class-validator';

export const IsNumberStringOrEmail = (validationOptions: ValidationOptions) => {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (!value) return true;

          return (
            isEmail(value) ||
            (typeof value === 'string' && !isNaN(Number(value)))
          );
        },
      },
    });
  };
};

@ValidatorConstraint({ async: true })
export class IsRequiredConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;

    const [requiredFields, notRequiredFields, judgmentFn] = args.constraints;

    for (const field of requiredFields) {
      if (Object.keys(object).includes(field)) {
        return judgmentFn(value);
      }
    }

    for (const field of notRequiredFields) {
      if (!Object.keys(object).includes(field)) {
        return judgmentFn(value);
      }
    }

    return true;
  }
}

export function IsFieldJudgment(
  requiredFields: string[] = [],
  notRequiredFields: string[] = [],
  judgmentFn: (value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [requiredFields, notRequiredFields, judgmentFn],
      validator: IsRequiredConstraint,
    });
  };
}

export const IsStringByField = (
  validationOptions: ValidationOptions,
  requiredFields: string[] = [],
  notRequiredFields: string[] = [],
) => {
  return IsFieldJudgment(
    requiredFields,
    notRequiredFields,
    (value) => typeof value === 'string',
    {
      message: '类型错误',
      ...validationOptions,
    },
  );
};

export const IsNotEmptyByField = (
  validationOptions: ValidationOptions,
  requiredFields: string[] = [],
  notRequiredFields: string[] = [],
) => {
  return IsFieldJudgment(
    requiredFields,
    notRequiredFields,
    (value) => Boolean(value),
    {
      message: '不能为空',
      ...validationOptions,
    },
  );
};

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
  'password',
  'username',
]) {
  @IsNumberStringOrEmail({ message: '账号需为纯数字' })
  @IsOptional()
  @ApiPropertyOptional({
    description: '账号',
    type: 'string',
    example: '794234293 / layouwen@gmail.com',
  })
  username?: string;

  @IsStringByField({ message: '邮箱需为字符串' }, [], ['username'])
  // @TODO 未实现邮箱校验
  // @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmptyByField({ message: '请输入邮箱' }, [], ['username'])
  @ApiProperty({
    description: '邮箱',
    type: 'string',
    example: 'layouwen@gmail.com',
  })
  email: string;

  @ApiProperty({ description: '验证码', type: 'string', example: '923a' })
  @IsStringByField({ message: '验证码需为字符串' }, ['username'])
  @IsNotEmptyByField({ message: '验证码错误' }, ['username'])
  captcha: string;

  @IsNotEmptyByField({ message: '请输入验证码' }, ['email'])
  @IsStringByField({ message: '验证码需为字符串' }, ['email'])
  @ApiProperty({
    description: '邮箱验证码',
    type: 'string',
    example: '33nd',
  })
  emailCode: string;

  @IsNotEmptyByField({ message: '请输入密码' }, ['username'])
  @IsStringByField({ message: '密码需为字符串' }, ['username'])
  @ApiProperty({
    description: '密码',
    type: 'string',
    example: 'layouwen',
  })
  password: string;
}
