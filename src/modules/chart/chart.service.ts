import { Injectable } from '@nestjs/common';
import {
  GetChartDataDto,
  GetChartDataDtoCategory,
} from './dto/get-chart-data.dto';
import { Record } from '../record/entity/record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRecordGroupData } from 'src/utils/record';
import { Category } from '../category/entity/category.entity';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
    const recordList = await this.recordRepository.find({
      where: {
        type: getChartDataDto.type,
        user: {
          id: userId,
        },
      },
      relations: ['category'],
    });

    const categoryList = await this.categoryRepository.find({
      where: {
        type: getChartDataDto.type,
        user: {
          id: userId,
        },
      },
    });

    return getRecordGroupData(
      recordList,
      getChartDataDto.category,
      categoryList,
    );
  }
}
