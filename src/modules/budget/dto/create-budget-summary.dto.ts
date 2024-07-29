import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CreateBudgetSummaryDto {
  @ApiProperty({
    description: '金额',
    example: '10000',
    type: String,
  })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: '预算类型 0: month 1: year',
    example: '0',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
