import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BudgetEntityType } from '../../../entity/budget.entity';

export class ClearBudgetDto {
  @ApiProperty({
    description: '预算类型 0: month 1: year',
    example: '0',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  type: BudgetEntityType;
}
