import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRecordGroupData } from 'src/utils/record';
import { success } from '../../utils';
import { CategoryEntity, RecordEntity } from '../../entity';
import {
  GetChartDataDto,
  GetChartDataDtoCategory,
} from './dto/get-chart-data.dto';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(RecordEntity)
    private recordRepository: Repository<RecordEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getChartCategoryItemList(
    userId: number,
    getChartDataDto: GetChartDataDto,
  ) {
    const { type, category } = getChartDataDto;

    const firstRecord = await this.recordRepository.findOne({
      where: {
        type,
        user: {
          id: userId,
        },
      },
      order: {
        time: 'ASC',
      },
    });

    const nowTime = new Date();
    let firstRecordTime = nowTime;

    if (firstRecord) {
      firstRecordTime = new Date(firstRecord.time);
    }

    const getAllYear = (startTime: Date, endTime: Date) => {
      const startYear = startTime.getFullYear();
      const endYear = endTime.getFullYear();
      const yearList = [];
      for (let i = startYear; i <= endYear; i++) {
        yearList.push(i);
      }
      return yearList;
    };

    switch (category) {
      case GetChartDataDtoCategory.WEEK:
      case GetChartDataDtoCategory.MONTH:
      case GetChartDataDtoCategory.YEAR:
        return getAllYear(firstRecordTime, nowTime);
      default:
        return getAllYear(firstRecordTime, nowTime);
    }
  }

  async getChartData(userId: number, getChartDataDto: GetChartDataDto) {
    const { type, category, categoryId } = getChartDataDto;

    const recordList = await this.recordRepository.find({
      where: {
        type,
        user: {
          id: userId,
        },
      },
      relations: ['category'],
    });

    const categoryList = await this.categoryRepository.find({
      where: {
        type,
        user: {
          id: userId,
        },
      },
    });

    let filterByCategory;
    if (categoryId) {
      filterByCategory = categoryList.find(
        item => item.id === Number(categoryId),
      );
    }

    return success(
      getRecordGroupData(recordList, category, categoryList, filterByCategory),
      '获取图表数据成功',
    );
  }
}
