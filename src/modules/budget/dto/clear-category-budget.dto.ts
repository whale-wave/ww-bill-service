import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClearCategoryBudgetDto {
  @ApiProperty({
    description: '预算类型 0: month 1: year',
    example: '0',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
