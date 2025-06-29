import * as dayjs from 'dayjs';
import { CategoryEntity, RecordEntity } from '../../entity';
import { GetChartDataDtoCategory } from '../../modules/chart/dto/get-chart-data.dto';
import { fillZero, mathHelper } from '../math';

export function getRankingByCategory(recordList: RecordEntity[], categoryList: CategoryEntity[], filterByCategory?: CategoryEntity) {
  let rankingList = [] as any[];

  if (filterByCategory) {
    rankingList = recordList.filter(
      r => r.category.id === filterByCategory.id,
    );
  }
  else {
    const categoryMap = new Map();

    categoryList.forEach((item) => {
      categoryMap.set(item.id, item);
    });

    const rankingMap = new Map();

    recordList.forEach((record) => {
      const categoryId = record.category.id;

      if (!rankingMap.has(categoryId)) {
        const category = categoryMap.get(categoryId);
        rankingMap.set(categoryId, {
          category,
          type: category.type,
          percentage: 0,
          amount: 0,
        });
      }

      const rankingItem = rankingMap.get(categoryId);

      rankingItem.amount = mathHelper
        .add(rankingItem.amount, record.amount)
        .toNumber();
    });

    rankingList = Array.from(rankingMap.values());
  }

  rankingList.sort((a, b) => Number(b.amount) - Number(a.amount));

  // Calculate the percentage and keep one decimal places.
  const totalAmount = rankingList.reduce(
    (acc, cur) => mathHelper.add(acc, cur.amount).toNumber(),
    0,
  );

  rankingList.forEach((item) => {
    item.percentage = mathHelper
      .multiply(mathHelper.divide(item.amount, totalAmount), 100)
      .toNumber()
      .toFixed(1);
  });

  return rankingList;
}

export function getYearInfo(_d: Date) {
  const d = new Date(Date.UTC(_d.getFullYear(), _d.getMonth(), _d.getDate()));

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const yearEnd = new Date(Date.UTC(d.getUTCFullYear() + 1, 0, 0));

  const yearMonthMap = new Map<number, Date>();

  for (let i = 1; i <= 12; i++) {
    yearMonthMap.set(i, new Date(Date.UTC(d.getUTCFullYear(), i - 1, 1)));
  }

  const yearMonthNoList = Array.from(yearMonthMap.keys());
  yearMonthNoList.sort((a, b) => a - b);

  return {
    year: d.getUTCFullYear(),
    yearStart,
    yearEnd,
    yearMonthMap,
    yearMonthNoList,
  };
}

export function getMonthInfo(_d: Date) {
  // 复制日期，避免修改原始日期
  const d = new Date(Date.UTC(_d.getFullYear(), _d.getMonth(), _d.getDate()));

  // 获取月份的第一天
  const monthStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));

  // 获取月份的最后一天
  const monthEnd = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  );

  const monthDayMap = new Map<number, Date>();

  for (let i = 1; i <= monthEnd.getDate(); i++) {
    monthDayMap.set(
      i,
      new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), i)),
    );
  }

  const monthDayList = Array.from(monthDayMap.keys());
  monthDayList.sort((a, b) => a - b);

  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    monthStart,
    monthEnd,
    monthDayMap,
    monthDayList,
  };
}

export function getWeekInfo(_d: Date) {
  // 复制日期，避免修改原始日期
  const d = new Date(Date.UTC(_d.getFullYear(), _d.getMonth(), _d.getDate()));

  // 定义一天的毫秒数
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

  // 将日期设为距离最近的周四（假设周四为一周的中心）：当前日期 + 4 - 当前星期数
  // 将周日的星期数设为7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  // 获取年份的第一天
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // 计算到最近周四的周数
  // （日期 - 年份的第一天）/ 一天的毫秒数 + 1）/ 7，向上取整得到周数
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / ONE_DAY_IN_MS + 1) / 7,
  );

  const weekStartDay = new Date(
    d.getTime() - (d.getUTCDay() - 1) * ONE_DAY_IN_MS,
  );
  const weekEndDay = new Date(
    d.getTime() + (7 - d.getUTCDay()) * ONE_DAY_IN_MS,
  );

  const weekDayNoList = [];
  const weekDayNoDateMap = new Map<number, Date>();
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDay.getTime() + i * ONE_DAY_IN_MS);
    const dayNo = date.getDate();
    weekDayNoList.push(dayNo);
    weekDayNoDateMap.set(dayNo, date);
  }

  return {
    year: d.getUTCFullYear(),
    week: weekNo,
    weekStartDay,
    weekEndDay,
    weekDayNoList,
    weekDayNoDateMap,
  };
}

export function getRecordMap(recordList: RecordEntity[]) {
  const recordMap = new Map();

  recordList.forEach((record) => {
    const year = new Date(record.time).getFullYear();
    const month = new Date(record.time).getMonth() + 1;
    const day = new Date(record.time).getDate();

    if (!recordMap.has(year)) {
      recordMap.set(year, new Map());
    }

    const yearMap = recordMap.get(year);

    if (!yearMap.has(month)) {
      yearMap.set(month, new Map());
    }

    const monthMap = yearMap.get(month);

    if (!monthMap.has(day)) {
      monthMap.set(day, []);
    }

    monthMap.get(day).push(record);
  });

  return recordMap;
}

export function getRecordGroupDataByYear(recordMap: Map<number, any>, categoryList: CategoryEntity[], filterByCategory?: CategoryEntity) {
  const yearKeys = Array.from(recordMap.keys());
  yearKeys.sort((a, b) => a - b);
  const result = yearKeys.reduce((res, year) => {
    const yearAllRecord = [] as RecordEntity[];

    const yearItem = {
      type: 'year',
      value: year,
      amount: 0,
      average: '0',
      data: [] as any[],
      ranking: [] as any[],
    };

    const yearData = recordMap.get(year);

    const { yearMonthNoList } = getYearInfo(new Date(`${year}-01-01`));
    yearMonthNoList.forEach((month) => {
      const monthItem = {
        type: 'month',
        value: `${year}-${fillZero(month)}`,
        amount: 0,
        data: [] as any[],
      };
      yearItem.data.push(monthItem);

      const monthData = yearData.get(month);

      if (monthData) {
        const dayKeys = Array.from(monthData.keys()) as number[];

        dayKeys.sort((a, b) => a - b);

        dayKeys.forEach((day) => {
          const dayDataList = monthData.get(day);

          dayDataList.forEach((dayData) => {
            yearAllRecord.push(dayData);

            monthItem.data.push(dayData);
            monthItem.amount = mathHelper
              .add(monthItem.amount, dayData.amount)
              .toNumber();
          });
        });

        monthItem.data.sort((a, b) => Number(b.amount) - Number(a.amount));

        yearItem.amount = mathHelper
          .add(yearItem.amount, monthItem.amount)
          .toNumber();
      }
    });

    // year ranking
    yearItem.ranking = getRankingByCategory(
      yearAllRecord,
      categoryList,
      filterByCategory,
    );

    // month average
    yearItem.average = mathHelper
      .divide(yearItem.amount, yearItem.data.length)
      .toNumber()
      .toFixed(2);

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
}

export function getRecordGroupDataByMonth(recordMap: Map<number, any>, categoryList: CategoryEntity[], filterCategory?: CategoryEntity) {
  const yearKeys = Array.from(recordMap.keys());
  yearKeys.sort((a, b) => a - b);
  const result = yearKeys.reduce((res, year) => {
    const yearItem = {
      type: 'year',
      value: year,
      data: [] as any[],
      amount: 0,
    };

    const yearData = recordMap.get(year);
    const monthKeys = Array.from(yearData.keys()) as number[];

    monthKeys.sort((a, b) => a - b);

    monthKeys.forEach((month) => {
      const monthAllRecord = [] as RecordEntity[];

      const monthData = yearData.get(month);

      const monthItem = {
        type: 'month',
        value: month,
        amount: 0,
        average: '0',
        data: [] as any[],
        ranking: [] as any[],
      };

      const { monthDayList } = getMonthInfo(
        new Date(`${year}-${fillZero(month)}-01`),
      );
      monthDayList.forEach((day) => {
        const dayItem = {
          type: 'day',
          value: `${year}-${fillZero(month)}-${fillZero(day)}`,
          data: [] as any[],
          amount: 0,
        };

        monthItem.data.push(dayItem);

        const dayDataList = monthData.get(day);

        if (dayDataList) {
          dayDataList.forEach((dayData) => {
            monthAllRecord.push(dayData);

            dayItem.data.push(dayData);
            dayItem.amount = mathHelper
              .add(dayItem.amount, dayData.amount)
              .toNumber();
          });

          dayItem.data.sort((a, b) => Number(b.amount) - Number(a.amount));

          monthItem.amount = mathHelper
            .add(monthItem.amount, dayItem.amount)
            .toNumber();
        }
      });

      // month ranking
      monthItem.ranking = getRankingByCategory(
        monthAllRecord,
        categoryList,
        filterCategory,
      );

      yearItem.data.push(monthItem);
      yearItem.amount = mathHelper
        .add(yearItem.amount, monthItem.amount)
        .toNumber();
    });

    // month average
    yearItem.data.forEach((monthItem) => {
      monthItem.average = mathHelper
        .divide(monthItem.amount, monthItem.data.length)
        .toNumber()
        .toFixed(2);
    });

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
}

export function getRecordGroupDataByWeek(recordMap: Map<number, any>, categoryList: CategoryEntity[], filterByCategory?: CategoryEntity) {
  const yearWeekDayDateMap = new Map();

  const yearWeekMap = new Map();

  const yearKeys = Array.from(recordMap.keys());
  yearKeys.sort((a, b) => a - b);

  yearKeys.forEach((year) => {
    const yearData = recordMap.get(year);
    const monthKeys = Array.from(yearData.keys()) as number[];
    monthKeys.sort((a, b) => a - b);

    monthKeys.forEach((month) => {
      const monthData = yearData.get(month);
      const dayKeys = Array.from(monthData.keys()) as number[];
      dayKeys.sort((a, b) => a - b);

      dayKeys.forEach((day) => {
        const dayData = monthData.get(day);

        dayData.forEach((item) => {
          const {
            year: yearNo,
            week: weekNo,
            weekDayNoList,
            weekDayNoDateMap,
          } = getWeekInfo(new Date(item.time));

          if (!yearWeekDayDateMap.has(yearNo)) {
            yearWeekDayDateMap.set(yearNo, new Map());
          }
          const yearWeekDayMap = yearWeekDayDateMap.get(yearNo);
          if (!yearWeekDayMap.has(weekNo)) {
            yearWeekDayMap.set(weekNo, new Map());
          }
          const weekDayDateMap = yearWeekDayMap.get(weekNo);

          if (!yearWeekMap.has(yearNo)) {
            yearWeekMap.set(yearNo, new Map());
          }

          const weekDayMap = yearWeekMap.get(yearNo);

          if (!weekDayMap.has(weekNo)) {
            weekDayMap.set(weekNo, new Map());
          }

          const dayMap = weekDayMap.get(weekNo);

          weekDayNoList.forEach((dayNo) => {
            weekDayDateMap.set(dayNo, weekDayNoDateMap.get(dayNo));
            if (!dayMap.has(dayNo)) {
              dayMap.set(dayNo, []);
            }
          });

          dayMap.get(day).push(item);
        });
      });
    });
  }, [] as any[]);

  const yearWeekKeys = Array.from(yearWeekMap.keys());
  yearWeekKeys.sort((a, b) => a - b);
  const result = yearWeekKeys.reduce((res, year) => {
    const yearItem = {
      type: 'year',
      value: year,
      data: [] as any[],
      amount: 0,
    };

    const weekDayMap = yearWeekMap.get(year);
    const weekKeys = Array.from(weekDayMap.keys()) as number[];
    weekKeys.sort((a, b) => a - b);

    weekKeys.forEach((week) => {
      const weekItem = {
        type: 'week',
        value: week,
        amount: 0,
        average: '0',
        data: [],
        ranking: [] as any[],
      };

      const weekAllRecord = [] as RecordEntity[];

      const dayMap = weekDayMap.get(week);
      const dayKeys = Array.from(dayMap.keys()) as number[];
      dayKeys.sort((a, b) => a - b);

      dayKeys.forEach((day) => {
        const dayList = dayMap.get(day);
        dayList.sort((a, b) => Number(b.amount) - Number(a.amount));

        const dayItem = {
          type: 'day',
          value: dayjs(yearWeekDayDateMap.get(year).get(week).get(day)).format(
            'YYYY-MM-DD',
          ),
          data: dayList,
          amount: dayList.reduce(
            (acc, cur) => mathHelper.add(acc, cur.amount).toNumber(),
            0,
          ),
        };

        weekItem.data.push(dayItem);
        weekItem.amount = mathHelper
          .add(weekItem.amount, dayItem.amount)
          .toNumber();

        weekAllRecord.push(...dayList);
      });

      // week ranking
      weekItem.ranking = getRankingByCategory(
        weekAllRecord,
        categoryList,
        filterByCategory,
      );

      // week average
      weekItem.average = mathHelper
        .divide(weekItem.amount, weekItem.data.length)
        .toNumber()
        .toFixed(2);

      yearItem.data.push(weekItem);
      yearItem.amount = mathHelper
        .add(yearItem.amount, weekItem.amount)
        .toNumber();
    });

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
}

export function getRecordGroupData(recordList: RecordEntity[], category: GetChartDataDtoCategory, categoryList: CategoryEntity[], filterByCategory?: CategoryEntity) {
  let filterRecordList = recordList;

  if (filterByCategory) {
    filterRecordList = recordList.filter(
      r => r.category.id === filterByCategory.id,
    );
  }

  const recordMap = getRecordMap(filterRecordList);

  switch (category) {
    case GetChartDataDtoCategory.WEEK:
      return getRecordGroupDataByWeek(
        recordMap,
        categoryList,
        filterByCategory,
      );
    case GetChartDataDtoCategory.MONTH:
      return getRecordGroupDataByMonth(
        recordMap,
        categoryList,
        filterByCategory,
      );
    case GetChartDataDtoCategory.YEAR:
    default:
      return getRecordGroupDataByYear(
        recordMap,
        categoryList,
        filterByCategory,
      );
  }
}
