import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({
    description: '公司名称',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: '税号',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  taxNumber: string;

  @ApiPropertyOptional({
    description: '单位地址',
    type: String,
  })
  @IsString()
  @IsOptional()
  companyAddress?: string;

  @ApiPropertyOptional({
    description: '电话号码',
    type: String,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: '开户银行',
    type: String,
  })
  @IsString()
  @IsOptional()
  accountOpeningBank?: string;

  @ApiPropertyOptional({
    description: '银行账号',
    type: String,
  })
  @IsString()
  @IsOptional()
  bankAccount?: string;
}
