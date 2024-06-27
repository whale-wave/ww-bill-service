import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export enum GetRecordBillDtoType {
  All = 'all',
  Year = 'year',
}

export class GetRecordBillDto {
  @ApiProperty({ description: '类别', enum: GetRecordBillDtoType, example: GetRecordBillDtoType.Year })
  @IsString()
  type: GetRecordBillDtoType;

  @ApiPropertyOptional({ description: '年份', example: '2024' })
  @IsNumberString()
  @IsOptional()
  year?: string;
}
