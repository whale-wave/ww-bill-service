import * as buffer from 'node:buffer';
import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import xlsl from 'node-xlsx';
import { Between, FindOneOptions, Like, ObjectLiteral, Repository } from 'typeorm';
import { mathHelper, throwFail } from '../../utils';
import { CategoryEntity } from '../../entity/category.entity';
import { UserEntity } from '../../entity/user.entity';
import { RecordEntity } from '../../entity';
import {
  CreateRecordDto,
  GetRecordListDto,
  UpdateRecordDto,
} from './dto/record.dto';
import { BillItem, calcEachMonthAmount, calcRecordListAmount } from './utils';
import { GetRecordBillDtoType } from './dto/GetRecordBillDto';

const typeMap = {
  支出: 'sub',
  收入: 'add',
};

export enum MoneyType {
  INCOME = 'add',
  EXPEND = 'sub',
}

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(RecordEntity)
    private recordRepository: Repository<RecordEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  findAll(options: FindOneOptions<RecordEntity>) {
    return this.recordRepository.find(options);
  }

  async create(userId: number, createRecordDto: CreateRecordDto) {
    const { time, remark, type, amount, categoryId } = createRecordDto;
    const user = await this.userRepository.findOne(userId);
    const category = await this.categoryRepository.findOne(categoryId);
    const record = new RecordEntity();
    record.user = user;
    record.time = dayjs(time).format();
    record.remark = remark;
    record.type = type;
    record.amount = amount;
    record.category = category;
    return await this.recordRepository.save(record);
  }

  remove(id: number) {
    return this.recordRepository.delete(id);
  }

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    const { categoryId, ...params } = updateRecordDto;
    const record = await this.findOne({ where: { id } });
    if (!record)
      throwFail('记录不存在');
    const category = await this.categoryRepository.findOne(categoryId);
    if (!category)
      throwFail('分类不存在');
    return this.recordRepository.save({ ...record, ...params, category });
  }

  findOne(options: FindOneOptions<RecordEntity>) {
    return this.recordRepository.findOne(options);
  }

  async findAllByUserIdAndParams(userId: number, params?: GetRecordListDto) {
    const options = {
      where: [{ user: userId }],
      order: { time: 'DESC', createdAt: 'DESC' },
      relations: ['category'],
    } as ObjectLiteral;

    const recordData = await this.recordRepository.findAndCount(options);

    if (params) {
      const { startDate, endDate, keyword } = params;

      if (keyword) {
        options.where = [
          { user: userId, remark: Like(`%${keyword}%`) },
          { user: userId, category: { name: Like(`%${keyword}%`) } },
        ];
      }

      if (startDate && endDate) {
        options.where.map((where: Record<string, any>) => {
          where.time = Between(
            dayjs(startDate).startOf('day').toDate(),
            dayjs(endDate).endOf('day').toDate(),
          );
          return where;
        });
      }
      else if (startDate) {
        options.where.map((where: Record<string, any>) => {
          where.time = Between(
            dayjs(startDate).startOf('month').toDate(),
            dayjs(startDate).endOf('month').toDate(),
          );
          return where;
        });
      }
    }

    const data = await this.recordRepository.find(options);
    const income = this.getIncome(data);
    const expend = this.getExpend(data);
    return { data, total: recordData[1], income, expend };
  }

  getIncome(data: RecordEntity[]) {
    return data
      .filter(i => i.type === MoneyType.INCOME)
      .reduce((a, b) => mathHelper.add(a, b.amount).toNumber(), 0);
  }

  getExpend(data: RecordEntity[]) {
    return data
      .filter(i => i.type === MoneyType.EXPEND)
      .reduce((a, b) => mathHelper.add(a, b.amount).toNumber(), 0);
  }

  async getBillRecord(id: number) {
    const { monthStart } = getTimestamp();
    const { month } = getNowTime();
    const { expend, income } = await this.findAllByUserIdAndParams(id, {
      startDate: monthStart,
    });
    const surplus = mathHelper.subtract(income, expend).toNumber();
    return {
      month,
      expend,
      income,
      surplus,
    };
  }

  async importData(buffer: buffer.Buffer, id: number) {
    const form = xlsl.parse(buffer);
    const arr = form[0].data.slice(1) as RecordExcelData[];
    const categoryMap = await this.getUserAllCategory(id);
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      const [category, remark, amount, typeZh, time] = arr[i];
      const categoryId = categoryMap[category];
      const date = new Date(1900, 0, Number(time) - 1);
      const type = typeMap[typeZh];
      if (categoryId && remark && amount && type && time) {
        try {
          await this.create(id, {
            time: date.toISOString(),
            categoryId: `${categoryId}`,
            remark,
            type,
            amount: `${amount}`,
          });
          count++;
        }
        catch (e) {
          console.error('--------------------------');
          console.error(`import data error: ${e}`);
          console.error(arr[i]);
          console.error('--------------------------');
        }
      }
    }
    return {
      fail: arr.length - count,
      all: arr.length,
    };
  }

  async getUserAllCategory(id: number) {
    const data = await this.categoryRepository.find({ where: { user: id } });
    return data.reduce((pre, { name, id }) => {
      pre[name] = id;
      return pre;
    }, {} as { [key: string]: number });
  }

  async getBill(userId: number, type: GetRecordBillDtoType, year?: string): Promise<{ list: Record<string, BillItem>; all: BillItem }> {
    switch (type) {
      case GetRecordBillDtoType.All: {
        return this.getBillByYearGroup(userId);
      }
      case GetRecordBillDtoType.Year: {
        if (!year)
          throwFail('参数错误');
        const res = await this.recordRepository.find({
          where: {
            user: userId,
            time: Between(
              dayjs(year).startOf('year').toDate(),
              dayjs(year).endOf('year').toDate(),
            ),
          },
        });
        return calcEachMonthAmount(res);
      }
      default:
        throwFail('参数错误');
    }
  }

  async getBillByYearGroup(userId: number) {
    const records = await this.recordRepository.find({
      where: { user: userId },
      order: { time: 'DESC' },
    });

    const yearGroup = records.reduce((pre, cur) => {
      const year = dayjs(cur.time).year();

      if (!pre[year]) {
        pre[year] = [];
      }

      pre[year].push(cur);

      return pre;
    }, {} as { [year: string]: RecordEntity[] });

    const list = Object.keys(yearGroup).reduce((pre, cur) => {
      const data = yearGroup[cur];
      pre[cur] = calcRecordListAmount(data);
      return pre;
    }, {} as { [year: string]: BillItem });

    const all = Object.keys(list).reduce((pre, cur) => {
      pre.income = mathHelper.add(list[cur].income, pre.income).toNumber();
      pre.expand = mathHelper.add(list[cur].expand, pre.expand).toNumber();
      pre.balance = mathHelper.add(list[cur].balance, pre.balance).toNumber();
      return pre;
    }, { income: 0, expand: 0, balance: 0 } as BillItem);

    return {
      list,
      all,
    };
  }
}

function getNowTime() {
  const now = new Date();
  const month = now.getMonth() + 1;
  return {
    month,
  };
}

function getTimestamp() {
  return {
    monthStart: dayjs(new Date()).startOf('month').format(),
  };
}

type RecordExcelData = [
  CategoryString,
  RemarkString,
  AmountNumber,
  TypeString,
  TimeString,
];
type CategoryString = string;
type RemarkString = string;
type AmountNumber = number;
type TypeString = keyof typeof typeMap;
type TimeString = string;
