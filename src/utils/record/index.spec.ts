import { Category } from './../../modules/category/entity/category.entity';
import { Record } from '../../modules/record/entity/record.entity';
import { getRecordGroupData } from './index';
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
      },
      {
        time: new Date('2024-01-04'),
        type: 'sub',
        amount: '1200',
      },
      {
        time: new Date('2023-04-21'),
        type: 'sub',
        amount: '140',
      },
      {
        time: new Date('2023-06-21'),
        type: 'sub',
        amount: '10',
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
        data: [
          {
            type: 'month',
            value: 4,
            data: [
              {
                time: new Date('2023-04-21'),
                type: 'sub',
                amount: '140',
              },
            ],
            amount: 140,
          },
          {
            type: 'month',
            value: 6,
            data: [
              {
                time: new Date('2023-06-21'),
                type: 'sub',
                amount: '10',
              },
            ],
            amount: 10,
          },
        ],
        amount: 150,
      },
      {
        type: 'year',
        value: 2024,
        data: [
          {
            type: 'month',
            value: 1,
            data: [
              {
                time: new Date('2024-01-01'),
                type: 'sub',
                amount: '1100',
              },
              {
                time: new Date('2024-01-04'),
                type: 'sub',
                amount: '1200',
              },
            ],
            amount: 2300,
          },
        ],
        amount: 2300,
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
      },
      {
        time: new Date('2024-01-04'),
        type: 'sub',
        amount: '1200',
      },
      {
        time: new Date('2023-04-21'),
        type: 'sub',
        amount: '140',
      },
      {
        time: new Date('2023-06-21'),
        type: 'sub',
        amount: '10',
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
            data: [
              {
                type: 'day',
                value: 21,
                amount: 140,
                data: [
                  {
                    time: new Date('2023-04-21'),
                    type: 'sub',
                    amount: '140',
                  },
                ],
              },
            ],
          },
          {
            type: 'month',
            value: 6,
            amount: 10,
            data: [
              {
                type: 'day',
                value: 21,
                amount: 10,
                data: [
                  {
                    time: new Date('2023-06-21'),
                    type: 'sub',
                    amount: '10',
                  },
                ],
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
            data: [
              {
                type: 'day',
                value: 1,
                amount: 1100,
                data: [
                  {
                    time: new Date('2024-01-01'),
                    type: 'sub',
                    amount: '1100',
                  },
                ],
              },
              {
                type: 'day',
                value: 4,
                amount: 1200,
                data: [
                  {
                    time: new Date('2024-01-04'),
                    type: 'sub',
                    amount: '1200',
                  },
                ],
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

    console.log(JSON.stringify(groupData, null, 2))

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
            data: [
              {
                type: 'day',
                value: 4,
                amount: 40,
                data: [recordList[0]],
              },
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
            data: [
              {
                type: 'day',
                value: 10,
                amount: 60,
                data: [recordList[1]],
              },
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
            data: [
              {
                type: 'day',
                value: 5,
                amount: 100,
                data: [recordList[2], recordList[3]],
              },
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
