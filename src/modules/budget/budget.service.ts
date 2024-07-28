import { Injectable } from '@nestjs/common';
import { Between, DeepPartial, FindConditions, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { BudgetEntity, BudgetEntityLevel, BudgetEntityType } from '../../entity/budget.entity';
import { Category } from '../category/entity/category.entity';
import { MoneyType, RecordService } from '../record/record.service';
import { math, throwFail } from '../../utils';
import { CategoryService } from '../category/category.service';
import { GetBudgetInfoDto } from './dto/get-budget-info.dto';

export interface BudgetResult {
  category?: Category;
  budgetAmount: number;
  amount: number;
  remaining: number;
  remainingPercentage: string;
}

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private readonly budgetRepository: Repository<BudgetEntity>,
    private readonly recordService: RecordService,
    private readonly categoryService: CategoryService,
  ) {
  }

  create(budget: DeepPartial<BudgetEntity>) {
    return this.budgetRepository.save(budget);
  }

  findAll(options: FindManyOptions<BudgetEntity>) {
    return this.budgetRepository.find(options);
  }

  findOne(options: FindManyOptions<BudgetEntity>) {
    return this.budgetRepository.findOne(options);
  }

  update(options: FindConditions<BudgetEntity>, updateBudgetDto: DeepPartial<BudgetEntity>) {
    return this.budgetRepository.update(options, updateBudgetDto);
  }

  remove(options: FindConditions<BudgetEntity>) {
    return this.budgetRepository.delete(options);
  }

  async createSummaryBudget(userId: number, summaryBudget: DeepPartial<BudgetEntity>): Promise<boolean> {
    const findSummaryBudget = await this.budgetRepository.findOne({
      where: {
        user: userId,
        type: summaryBudget.type,
        level: BudgetEntityLevel.SUMMARY,
      },
    });

    if (findSummaryBudget) {
      throwFail('已存在总预算');
    }

    summaryBudget.user = { id: userId };
    summaryBudget.level = BudgetEntityLevel.SUMMARY;
    delete summaryBudget.category;

    await this.budgetRepository.save(summaryBudget);

    return true;
  }

  async summaryBudgetAmountCheck(): Promise<boolean> {
    // TODO: 总预算金额校验
    return false;
  }

  async createCategoryBudget(userId: number, summaryBudget: DeepPartial<BudgetEntity>): Promise<boolean> {
    const findCategoryBudget = await this.budgetRepository.findOne({
      where: {
        user: userId,
        type: summaryBudget.type,
        category: summaryBudget.category,
        level: BudgetEntityLevel.CATEGORY,
      },
    });

    if (findCategoryBudget) {
      throwFail('已存在该分类预算');
    }

    const findCategory = await this.categoryService.findOne({
      where: {
        user: userId,
        id: summaryBudget.category,
        type: MoneyType.EXPEND,
      },
    });

    if (!findCategory) {
      throwFail('分类不存在');
    }

    summaryBudget.user = {
      id: userId,
    };
    summaryBudget.level = BudgetEntityLevel.CATEGORY;

    await this.budgetRepository.save(summaryBudget);

    return true;
  }

  async getBudgetInfo(userId: number, getBudgetInfoDto: GetBudgetInfoDto) {
    const data = {
      summaryBudget: undefined,
      categoryBudgets: undefined,
    } as {
      summaryBudget?: BudgetResult;
      categoryBudgets?: BudgetResult[];
    };

    /* Get summary budget */

    const summaryBudget = await this.budgetRepository.findOne({
      where: {
        user: userId,
        type: getBudgetInfoDto.type,
        level: BudgetEntityLevel.SUMMARY,
      },
    });

    if (!summaryBudget) {
      return data;
    }

    const dayjsRange = getBudgetInfoDto.type === BudgetEntityType.MONTH ? 'month' : 'year';

    const recordList = await this.recordService.findAll({
      where: {
        user: userId,
        type: MoneyType.EXPEND,
        time: Between(
          dayjs().startOf(dayjsRange).toDate(),
          dayjs().endOf(dayjsRange).toDate(),
        ),
      },
      relations: ['category'],
    });

    data.summaryBudget = {
      budgetAmount: +summaryBudget.amount,
      amount: recordList.reduce((total, record) => math.add(total, record.amount).toNumber(), 0),
      remaining: 0,
      remainingPercentage: '0',
    };
    data.summaryBudget.remaining = math.subtract(data.summaryBudget.budgetAmount, data.summaryBudget.amount).toNumber();
    data.summaryBudget.remainingPercentage = (math.divide(data.summaryBudget.remaining, data.summaryBudget.budgetAmount).toNumber() * 100).toFixed();

    /* Get category budget */

    const categoryBudgets = await this.budgetRepository.find({
      where: {
        user: userId,
        type: getBudgetInfoDto.type,
        level: BudgetEntityLevel.CATEGORY,
      },
      relations: ['category'],
    });

    if (categoryBudgets.length > 0) {
      const _categoryBudgets = [] as BudgetResult[];

      for (const categoryBudget of categoryBudgets) {
        const _categoryBudget = {
          category: categoryBudget.category,
          budgetAmount: +categoryBudget.amount,
          amount: recordList.filter(record => record.category.id === categoryBudget.category.id).reduce((sum, cur) => math.add(sum, cur.amount).toNumber(), 0),
          remaining: 0,
          remainingPercentage: '0',
        } as BudgetResult;

        _categoryBudget.remaining = math.subtract(_categoryBudget.budgetAmount, _categoryBudget.amount).toNumber();
        _categoryBudget.remainingPercentage = (math.divide(_categoryBudget.remaining, _categoryBudget.budgetAmount).toNumber() * 100).toFixed();

        _categoryBudgets.push(_categoryBudget);
      }

      data.categoryBudgets = _categoryBudgets;
    }

    return data;
  }
}
