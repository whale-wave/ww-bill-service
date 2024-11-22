import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    description: '资产名称',
    example: '0',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '资产备注',
    example: '0',
    type: String,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: '资产金额',
    example: '0',
    type: String,
  })
  @IsString()
  amount: string;

  @ApiProperty({
    description: '资产分组ID',
    example: '0',
    type: String,
  })
  @IsString()
  groupId: string;
}

export class AdjustAssetDto {
  @ApiProperty({
    description: '资产金额',
    example: '0',
    type: String,
  })
  @IsString()
  @IsOptional()
  amount?: string;

  @ApiProperty({
    description: '资产备注',
    example: '0',
    type: String,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: '资产名称',
    example: '0',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
