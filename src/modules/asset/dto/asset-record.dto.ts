import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAssetRecordDto {
  @ApiProperty({
    description: '资产记录名称',
    example: '0',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '资产记录类型',
    example: 'add | sub',
    type: String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: '资产记录金额',
    example: '0',
    type: String,
  })
  @IsString()
  amount: string;

  @ApiPropertyOptional({
    description: '资产记录备注',
    example: '0',
    type: String,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: '资产记录关联资产ID',
    example: '0',
    type: String,
  })
  @IsString()
  assetId: string;
}

export class UpdateAssetRecordDto extends PartialType(
  PickType(CreateAssetRecordDto, ['amount', 'comment', 'name']),
) {}

export class GetAssetRecordQueryDto extends PickType(CreateAssetRecordDto, [
  'assetId',
]) {}
