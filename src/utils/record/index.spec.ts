import { Category } from './../../modules/category/entity/category.entity';
import { Record } from '../../modules/record/entity/record.entity';
import { getMonthInfo, getRecordGroupData, getYearInfo } from './index';
import { GetChartDataDtoCategory } from '../../modules/chart/dto/get-chart-data.dto';

const categoryList = [
  {
    id: 1,
    type: 'sub',
    name: '餐饮',
  },
  {
    id: 8,
    type: 'sub',
    name: '运动',
  },
] as unknown as Category[];

const categoryMap = {
  1: categoryList[0],
  8: categoryList[1],
};

describe('record', () => {
  it('getRecordGroupData by year', () => {
    const recordList = [
      {
        time: new Date('2024-01-01'),
        type: 'sub',
        amount: '1100',
        category: categoryMap[1],
      },
      {
        time: new Date('2024-01-04'),
        type: 'sub',
        amount: '1200',
        category: categoryMap[8],
      },
      {
        time: new Date('2023-04-21'),
        type: 'sub',
        amount: '140',
        category: categoryMap[8],
      },
      {
        time: new Date('2023-06-21'),
        type: 'sub',
        amount: '10',
        category: categoryMap[8],
      },
    ] as unknown as Record[];

    const groupData = getRecordGroupData(
      recordList,
      GetChartDataDtoCategory.YEAR,
      categoryList,
    );

    const result = [
      {
        type: 'year',
        value: 2023,
        amount: 150,
        average: '12.50',
        data: [
          ...getYearInfo(
            recordList[2].time as unknown as Date,
          ).yearMonthNoList.map((monthNo) => {
            const month = {
              type: 'month',
              value: `2023-${monthNo < 10 ? `0${monthNo}` : monthNo}`,
              amount: 0,
              data: [],
            };

            if (monthNo === 4) {
              month.amount = 140;
              month.data = [recordList[2]];
            } else if (monthNo === 6) {
              month.amount = 10;
              month.data = [recordList[3]];
            }

            return month;
          }),
        ],
        ranking: [
          {
            type: 'sub',
            amount: 150,
            percentage: '100.0',
            category: categoryMap[8],
          },
        ],
      },
      {
        type: 'year',
        value: 2024,
        amount: 2300,
        average: '191.67',
        data: [
          ...getYearInfo(
            recordList[0].time as unknown as Date,
          ).yearMonthNoList.map((monthNo) => {
            const month = {
              type: 'month',
              value: `2024-${monthNo < 10 ? `0${monthNo}` : monthNo}`,
              amount: 0,
              data: [],
            };

            if (monthNo === 1) {
              month.amount = 2300;
              month.data = [recordList[0], recordList[1]];
            }

            return month;
          }),
        ],
        ranking: [
          {
            type: 'sub',
            amount: 1200,
            percentage: '52.2',
            category: categoryMap[8],
          },
          {
            type: 'sub',
            amount: 1100,
            percentage: '47.8',
            category: categoryMap[1],
          },
        ],
      },
    ];

    expect(groupData).toEqual(result);
  });

  it('getRecordGroupData by month', () => {
    const recordList = [
      {
        time: new Date('2024-01-01'),
        type: 'sub',
        amount: '1100',
        category: categoryMap[1],
      },
      {
        time: new Date('2024-01-04'),
        type: 'sub',
        amount: '1200',
        category: categoryMap[8],
      },
      {
        time: new Date('2023-04-21'),
        type: 'sub',
        amount: '140',
        category: categoryMap[8],
      },
      {
        time: new Date('2023-06-21'),
        type: 'sub',
        amount: '10',
        category: categoryMap[8],
      },
    ] as unknown as Record[];

    const groupData = getRecordGroupData(
      recordList,
      GetChartDataDtoCategory.MONTH,
      categoryList,
    );

    const result = [
      {
        type: 'year',
        value: 2023,
        amount: 150,
        data: [
          {
            type: 'month',
            value: 4,
            amount: 140,
            average: '4.67',
            data: [
              ...getMonthInfo(
                recordList[2].time as unknown as Date,
              ).monthDayList.map((dayNo) => {
                const day = {
                  type: 'day',
                  value: `2023-04-${dayNo < 10 ? `0${dayNo}` : dayNo}`,
                  amount: 0,
                  data: [],
                };

                if (dayNo === 21) {
                  day.amount = 140;
                  day.data = [recordList[2]];
                }

                return day;
              }),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 140,
                percentage: '100.0',
                category: categoryMap[8],
              },
            ],
          },
          {
            type: 'month',
            value: 6,
            amount: 10,
            average: '0.33',
            data: [
              ...getMonthInfo(
                recordList[3].time as unknown as Date,
              ).monthDayList.map((dayNo) => {
                const day = {
                  type: 'day',
                  value: `2023-06-${dayNo < 10 ? `0${dayNo}` : dayNo}`,
                  amount: 0,
                  data: [],
                };

                if (dayNo === 21) {
                  day.amount = 10;
                  day.data = [recordList[3]];
                }

                return day;
              }),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 10,
                percentage: '100.0',
                category: categoryMap[8],
              },
            ],
          },
        ],
      },
      {
        type: 'year',
        value: 2024,
        amount: 2300,
        data: [
          {
            type: 'month',
            value: 1,
            amount: 2300,
            average: '74.19',
            data: [
              ...getMonthInfo(
                recordList[0].time as unknown as Date,
              ).monthDayList.map((dayNo) => {
                const day = {
                  type: 'day',
                  value: `2024-01-${dayNo < 10 ? `0${dayNo}` : dayNo}`,
                  amount: 0,
                  data: [],
                };

                if (dayNo === 1) {
                  day.amount = 1100;
                  day.data = [recordList[0]];
                } else if (dayNo === 4) {
                  day.amount = 1200;
                  day.data = [recordList[1]];
                }

                return day;
              }),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 1200,
                percentage: '52.2',
                category: categoryMap[8],
              },
              {
                type: 'sub',
                amount: 1100,
                percentage: '47.8',
                category: categoryMap[1],
              },
            ],
          },
        ],
      },
    ];

    expect(groupData).toEqual(result);
  });

  it('getRecordGroupData by week', () => {
    const recordList = [
      {
        time: new Date('2023-01-04 05:00:00'),
        type: 'sub',
        amount: '40',
        category: categoryMap[1],
      },
      {
        time: new Date('2023-01-10 06:00:00'),
        type: 'sub',
        amount: '60',
        category: categoryMap[8],
      },
      {
        time: new Date('2024-01-05 06:00:00'),
        type: 'sub',
        amount: '90',
        category: categoryMap[8],
      },
      {
        time: new Date('2024-01-05 10:00:00'),
        type: 'sub',
        amount: '10',
        category: categoryMap[1],
      },
    ] as unknown as Record[];

    const groupData = getRecordGroupData(
      recordList,
      GetChartDataDtoCategory.WEEK,
      categoryList,
    );

    const result = [
      {
        type: 'year',
        value: 2023,
        amount: 100,
        data: [
          {
            type: 'week',
            value: 1,
            amount: 40,
            average: '5.71',
            data: [
              ...[2, 3].map((i) => ({
                type: 'day',
                value: `2023-01-0${i}`,
                amount: 0,
                data: [],
              })),
              {
                type: 'day',
                value: `2023-01-04`,
                amount: 40,
                data: [recordList[0]],
              },
              ...[5, 6, 7, 8].map((i) => ({
                type: 'day',
                value: `2023-01-0${i}`,
                amount: 0,
                data: [],
              })),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 40,
                percentage: '100.0',
                category: categoryMap[1],
              },
            ],
          },
          {
            type: 'week',
            value: 2,
            amount: 60,
            average: '8.57',
            data: [
              ...[9].map((i) => ({
                type: 'day',
                value: `2023-01-0${i}`,
                amount: 0,
                data: [],
              })),
              {
                type: 'day',
                value: `2023-01-10`,
                amount: 60,
                data: [recordList[1]],
              },
              ...[11, 12, 13, 14, 15].map((i) => ({
                type: 'day',
                value: `2023-01-${i}`,
                amount: 0,
                data: [],
              })),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 60,
                percentage: '100.0',
                category: categoryMap[8],
              },
            ],
          },
        ],
      },
      {
        type: 'year',
        value: 2024,
        amount: 100,
        data: [
          {
            type: 'week',
            value: 1,
            amount: 100,
            average: '14.29',
            data: [
              ...['01', '02', '03', '04'].map((i) => ({
                type: 'day',
                value: `2024-01-${i}`,
                amount: 0,
                data: [],
              })),
              {
                type: 'day',
                value: `2024-01-05`,
                amount: 100,
                data: [recordList[2], recordList[3]],
              },
              ...['06', '07'].map((i) => ({
                type: 'day',
                value: `2024-01-${i}`,
                amount: 0,
                data: [],
              })),
            ],
            ranking: [
              {
                type: 'sub',
                amount: 90,
                percentage: '90.0',
                category: categoryMap[8],
              },
              {
                type: 'sub',
                amount: 10,
                percentage: '10.0',
                category: categoryMap[1],
              },
            ],
          },
        ],
      },
    ];

    expect(groupData).toEqual(result);
  });
});
