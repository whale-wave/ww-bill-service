import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { StartEndTimeQueryDto } from 'src/dto';
import { AssetStatisticalRecordType } from '../../../entity';

export class GetAssetStatisticalRecordQueryDto extends StartEndTimeQueryDto {
  @ApiProperty({ description: '统计类型' })
  @IsEnum(AssetStatisticalRecordType)
  type: AssetStatisticalRecordType;
}
