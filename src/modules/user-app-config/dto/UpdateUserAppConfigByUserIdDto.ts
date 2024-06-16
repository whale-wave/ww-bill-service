import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAppConfigByUserIdDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '是否显示金额',
    type: Boolean,
  })
  isDisplayAmount?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '是否显示金额开关',
    type: Boolean,
  })
  isDisplayAmountSwitch?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: '是否开启声音效果',
    type: Boolean,
  })
  isOpenSoundEffect?: boolean;
}
