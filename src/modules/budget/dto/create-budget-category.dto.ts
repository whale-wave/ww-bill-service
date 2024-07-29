import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateBudgetSummaryDto } from './create-budget-summary.dto';

export class CreateBudgetCategoryDto extends CreateBudgetSummaryDto {
  @ApiProperty({
    description: '预算分类',
    example: '0',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  category: number;
}
