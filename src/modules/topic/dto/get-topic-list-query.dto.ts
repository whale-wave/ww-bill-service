import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { PageQueryDto } from '../../../dto/page-query.dto';

export class GetTopicListQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '是否推荐',
    example: 'false',
  })
  @IsBooleanString({ message: '请输入布尔值' })
  @IsOptional()
  recommend?: boolean;
}
