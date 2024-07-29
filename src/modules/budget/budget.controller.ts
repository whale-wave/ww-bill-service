import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RESPONSE_STATUS_CODE, sendSuccess } from '../../utils';
import { BudgetService } from './budget.service';
import { GetBudgetInfoDto } from './dto/get-budget-info.dto';
import { GetBudgetInfoQueryDto } from './dto/get-budget-info-query.dto';
import { CreateBudgetCategoryDto } from './dto/create-budget-category.dto';
import { CreateBudgetSummaryDto } from './dto/create-budget-summary.dto';
import { ClearBudgetDto } from './dto/clear-budget.dto';
import { ClearCategoryBudgetDto } from './dto/clear-category-budget.dto';
import { PatchBudgetAmountDto } from './dto/patch-budget-amount.dto';

@ApiTags('budget')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @ApiOperation({ summary: '获取预算信息' })
  @Get('info')
  async getBudgetInfo(
    @Req() req: any,
    @Query() getBudgetInfoQueryDto: GetBudgetInfoQueryDto,
  ) {
    const { type, ...rest } = getBudgetInfoQueryDto;
    const getBudgetInfoDto = {
      ...rest,
      type: +getBudgetInfoQueryDto.type,
    } as GetBudgetInfoDto;

    const budgetInfo = await this.budgetService.getBudgetInfo(
      req.user.id,
      getBudgetInfoDto,
    );

    return sendSuccess({
      data: budgetInfo,
    });
  }

  @ApiOperation({ summary: '创建总预算' })
  @Post('summary')
  async createSummaryBudget(
    @Req() req: any,
    @Body() createBudgetSummaryDto: CreateBudgetSummaryDto,
  ) {
    await this.budgetService.createSummaryBudget(
      req.user.id,
      createBudgetSummaryDto,
    );

    return sendSuccess();
  }

  @ApiOperation({ summary: '创建分类预算' })
  @Post('category')
  async createCategoryBudget(
    @Req() req: any,
    @Body() createBudgetCategoryDto: CreateBudgetCategoryDto,
  ) {
    await this.budgetService.createCategoryBudget(req.user.id, {
      ...createBudgetCategoryDto,
      category: {
        id: createBudgetCategoryDto.category,
      },
    });

    if (
      await this.budgetService.summaryBudgetAmountCheck(
        req.user.id,
        createBudgetCategoryDto.type,
      )
    ) {
      return sendSuccess({
        statusCode: RESPONSE_STATUS_CODE.RECALCULATE_BUDGET_SUCCESS,
      });
    }

    return sendSuccess();
  }

  @ApiOperation({ summary: '清空预算' })
  @Post('clear')
  async clearBudget(@Req() req: any, @Body() clearBudgetDto: ClearBudgetDto) {
    await this.budgetService.clearBudget(req.user.id, clearBudgetDto.type);

    return sendSuccess();
  }

  @ApiOperation({ summary: '删除分类预算' })
  @Delete('category/:budgetId')
  async clearCategoryBudget(
    @Req() req: any,
    @Param('budgetId') budgetId: string,
    @Body() clearCategoryBudgetDto: ClearCategoryBudgetDto,
  ) {
    await this.budgetService.clearCategoryBudgetById(
      req.user.id,
      clearCategoryBudgetDto.type,
      budgetId,
    );

    return sendSuccess();
  }

  @ApiOperation({ summary: '编辑预算' })
  @Patch(':budgetId/amount')
  async patchBudgetAmount(
    @Req() req: any,
    @Param('budgetId') budgetId: string,
    @Body() patchBudgetAmountDto: PatchBudgetAmountDto,
  ) {
    await this.budgetService.updateBudgetAmountById(
      req.user.id,
      budgetId,
      patchBudgetAmountDto,
    );

    return sendSuccess();
  }
}
