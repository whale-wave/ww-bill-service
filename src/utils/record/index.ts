import { Category } from '../../modules/category/entity/category.entity';
import { GetChartDataDtoCategory } from '../../modules/chart/dto/get-chart-data.dto';
import { Record } from '../../modules/record/entity/record.entity';
import math from '../math';

export const getRankingByCategory = (
  recordList: Record[],
  categoryList: Category[],
) => {
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
        category: category,
        type: category.type,
        percentage: 0,
        amount: 0,
      });
    }

    const rankingItem = rankingMap.get(categoryId);

    rankingItem.amount = math.add(rankingItem.amount, record.amount).toNumber();
  });

  const rankingList = Array.from(rankingMap.values());

  rankingList.sort((a, b) => b.amount - a.amount);

  // Calculate the percentage and keep one decimal places.
  const totalAmount = rankingList.reduce(
    (acc, cur) => math.add(acc, cur.amount).toNumber(),
    0,
  );

  rankingList.forEach((item) => {
    item.percentage = math
      .multiply(math.divide(item.amount, totalAmount), 100)
      .toNumber()
      .toFixed(1);
  });

  return rankingList;
};

export const getWeekNumber = (_d: Date) => {
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

  // 返回年份和周数数组
  return {
    year: d.getUTCFullYear(),
    week: weekNo,
  };
};

export const getRecordMap = (recordList: Record[]) => {
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
};

export const getRecordGroupDataByYear = (recordMap: Map<number, any>) => {
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
      const monthData = yearData.get(month);
      const dayKeys = Array.from(monthData.keys()) as number[];

      dayKeys.sort((a, b) => a - b);

      const monthItem = {
        type: 'month',
        value: month,
        data: [] as any[],
        amount: 0,
      };

      dayKeys.forEach((day) => {
        const dayDataList = monthData.get(day);

        dayDataList.forEach((dayData) => {
          monthItem.data.push(dayData);
          monthItem.amount = math
            .add(monthItem.amount, dayData.amount)
            .toNumber();
        });
      });

      yearItem.data.push(monthItem);
      yearItem.amount = math.add(yearItem.amount, monthItem.amount).toNumber();
    });

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
};

export const getRecordGroupDataByMonth = (recordMap: Map<number, any>) => {
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
      const monthData = yearData.get(month);
      const dayKeys = Array.from(monthData.keys()) as number[];

      dayKeys.sort((a, b) => a - b);

      const monthItem = {
        type: 'month',
        value: month,
        data: [] as any[],
        amount: 0,
      };

      dayKeys.forEach((day) => {
        const dayDataList = monthData.get(day);

        const dayItem = {
          type: 'day',
          value: day,
          data: [] as any[],
          amount: 0,
        };

        dayDataList.forEach((dayData) => {
          dayItem.data.push(dayData);
          dayItem.amount = math.add(dayItem.amount, dayData.amount).toNumber();
        });

        monthItem.data.push(dayItem);
        monthItem.amount = math
          .add(monthItem.amount, dayItem.amount)
          .toNumber();
      });

      yearItem.data.push(monthItem);
      yearItem.amount = math.add(yearItem.amount, monthItem.amount).toNumber();
    });

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
};

export const getRecordGroupDataByWeek = (
  recordMap: Map<number, any>,
  categoryList: Category[],
) => {
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
          const { year: yearNo, week: weekNo } = getWeekNumber(
            new Date(item.time),
          );

          if (!yearWeekMap.has(yearNo)) {
            yearWeekMap.set(yearNo, new Map());
          }

          const weekDayMap = yearWeekMap.get(yearNo);

          if (!weekDayMap.has(weekNo)) {
            weekDayMap.set(weekNo, new Map());
          }

          const dayMap = weekDayMap.get(weekNo);

          if (!dayMap.has(day)) {
            dayMap.set(day, []);
          }

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
        data: [],
        ranking: [] as any[],
      };

      const weekAllRecord = [] as Record[];

      const dayMap = weekDayMap.get(week);
      const dayKeys = Array.from(dayMap.keys()) as number[];
      dayKeys.sort((a, b) => a - b);

      dayKeys.forEach((day) => {
        const weekDataList = dayMap.get(day);
        weekDataList.sort((a, b) => Number(b.amount) - Number(a.amount));

        const dayItem = {
          type: 'day',
          value: day,
          data: weekDataList,
          amount: weekDataList.reduce(
            (acc, cur) => math.add(acc, cur.amount).toNumber(),
            0,
          ),
        };

        weekItem.data.push(dayItem);
        weekItem.amount = math.add(weekItem.amount, dayItem.amount).toNumber();

        weekAllRecord.push(...weekDataList);
      });

      // week ranking
      weekItem.ranking = getRankingByCategory(weekAllRecord, categoryList);

      yearItem.data.push(weekItem);
      yearItem.amount = math.add(yearItem.amount, weekItem.amount).toNumber();
    });

    res.push(yearItem);

    return res;
  }, [] as any[]);

  return result;
};

export const getRecordGroupData = (
  recordList: Record[],
  category: GetChartDataDtoCategory,
  categoryList: Category[],
) => {
  const recordMap = getRecordMap(recordList);

  switch (category) {
    case GetChartDataDtoCategory.WEEK:
      return getRecordGroupDataByWeek(recordMap, categoryList);
    case GetChartDataDtoCategory.MONTH:
      return getRecordGroupDataByMonth(recordMap);
    case GetChartDataDtoCategory.YEAR:
      return getRecordGroupDataByYear(recordMap);
    default:
      return getRecordGroupDataByYear(recordMap);
  }
};
