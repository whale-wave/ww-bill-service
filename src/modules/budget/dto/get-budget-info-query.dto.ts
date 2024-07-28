import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetBudgetInfoQueryDto {
  @ApiProperty({ example: 0, description: '预算类型 0: month 1: year', type: String })
  @IsNumberString()
  @IsNotEmpty()
  type: string;
}
