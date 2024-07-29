import { OmitType } from '@nestjs/swagger';
import { GetBudgetInfoQueryDto } from './get-budget-info-query.dto';

export class GetBudgetInfoDto extends OmitType(GetBudgetInfoQueryDto, ['type']) {
  type: number;
}
