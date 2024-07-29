import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { BudgetEntityType } from '../../../entity/budget.entity';

export class PatchBudgetAmountDto {
  @ApiProperty({
    description: '预算金额',
    example: '10000',
    type: String,
  })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @ApiProperty({
    description: '预算类型 0: Month 1: Year',
    example: '1',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  type: BudgetEntityType;
}
