import { IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParamDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  @IsNumberString({}, { message: '必须为数字字符串' })
  @ApiProperty({ description: '记录 id', example: '394' })
  id: string;
}
