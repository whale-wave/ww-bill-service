import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export enum GetChartDataDtoCategory {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class GetChartDataDto {
  @ApiProperty({
    description: '类型 (sub 支出 | add 收入)',
    enum: ['sub', 'add'],
    example: 'sub',
  })
  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(
    {
      支出: 'sub',
      收入: 'add',
    },
    {
      message: 'type is invalid',
    },
  )
  type: 'sub' | 'add';

  @ApiProperty({
    description: '类别 (week 按周 | month 按月 | year 按年)',
    enum: GetChartDataDtoCategory,
    example: 'week',
  })
  @IsNotEmpty({ message: 'category is required' })
  @IsEnum(GetChartDataDtoCategory, {
    message: 'category is invalid',
  })
  category: GetChartDataDtoCategory;

  @ApiPropertyOptional({
    description: '类别id',
    example: 1,
  })
  @IsNumberString()
  @IsOptional()
  categoryId?: string;
}
