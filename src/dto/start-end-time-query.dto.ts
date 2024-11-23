import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StartEndTimeQueryDto {
  @ApiPropertyOptional({
    description: '开始时间',
    example: '1716537600',
  })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({
    description: '结束时间',
    example: '1716537600',
  })
  @IsString()
  @IsOptional()
  endTime?: string;
}
