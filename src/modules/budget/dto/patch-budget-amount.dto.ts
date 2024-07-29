import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PatchBudgetAmountDto {
  @ApiProperty({
    description: '预算金额',
    example: '10000',
    type: String,
  })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;
}
