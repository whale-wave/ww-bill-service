import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RESPONSE_STATUS_CODE, sendSuccess } from '../../utils';
import { BudgetService } from './budget.service';
import { GetBudgetInfoDto } from './dto/get-budget-info.dto';
import { GetBudgetInfoQueryDto } from './dto/get-budget-info-query.dto';

@ApiTags('budget')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {
  }

  @ApiOperation({ summary: '获取预算信息' })
  @Get('info')
  async getBudgetInfo(@Req() req: any, @Query() getBudgetInfoQueryDto: GetBudgetInfoQueryDto) {
    const { type, ...rest } = getBudgetInfoQueryDto;
    const getBudgetInfoDto = {
      ...rest,
      type: +getBudgetInfoQueryDto.type,
    } as GetBudgetInfoDto;

    const budgetInfo = await this.budgetService.getBudgetInfo(req.user.id, getBudgetInfoDto);

    return sendSuccess({
      data: budgetInfo,
    });
  }

  @ApiOperation({ summary: '创建总预算' })
  @Post('summary')
  async createSummaryBudget(@Req() req: any, @Body() summaryBudget: any) {
    await this.budgetService.createSummaryBudget(req.user.id, summaryBudget);

    if (await this.budgetService.summaryBudgetAmountCheck()) {
      sendSuccess({
        statusCode: RESPONSE_STATUS_CODE.RECALCULATE_BUDGET_SUCCESS,
      });
    }

    return sendSuccess();
  }

  @ApiOperation({ summary: '创建分类预算' })
  @Post('category')
  async createCategoryBudget(@Req() req: any, @Body() categoryBudget: any) {
    await this.budgetService.createCategoryBudget(req.user.id, categoryBudget);

    if (await this.budgetService.summaryBudgetAmountCheck()) {
      sendSuccess({
        statusCode: RESPONSE_STATUS_CODE.RECALCULATE_BUDGET_SUCCESS,
      });
    }

    return sendSuccess();
  }
}
