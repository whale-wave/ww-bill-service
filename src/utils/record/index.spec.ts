import { Record } from '../../modules/record/entity/record.entity';
import { getRecordGroupData } from './index';
import { GetChartDataDtoCategory } from '../../modules/chart/dto/get-chart-data.dto';

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
        time: new Date('2023-01-06'),
        type: 'sub',
        amount: '200',
      },
      {
        time: new Date('2023-01-05'),
        type: 'sub',
        amount: '100',
      },
      {
        time: new Date('2024-01-06'),
        type: 'sub',
        amount: '1100',
      },
      {
        time: new Date('2024-01-04'),
        type: 'sub',
        amount: '1200',
      },
      {
        time: new Date('2023-01-10'),
        type: 'sub',
        amount: '140',
      },
      {
        time: new Date('2023-01-11'),
        type: 'sub',
        amount: '10',
      },
    ] as unknown as Record[];

    const groupData = getRecordGroupData(
      recordList,
      GetChartDataDtoCategory.WEEK,
    );

    const result = [
      {
        type: 'year',
        value: 2023,
        amount: 450,
        data: [
          {
            type: 'week',
            value: 1,
            amount: 300,
            data: [
              {
                time: new Date('2023-01-06'),
                type: 'sub',
                amount: '200',
              },
              {
                time: new Date('2023-01-05'),
                type: 'sub',
                amount: '100',
              },
            ],
          },
          {
            type: 'week',
            value: 2,
            amount: 150,
            data: [
              {
                time: new Date('2023-01-11'),
                type: 'sub',
                amount: '10',
              },
              {
                time: new Date('2023-01-10'),
                type: 'sub',
                amount: '140',
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
            type: 'week',
            value: 1,
            amount: 2300,
            data: [
              {
                time: new Date('2024-01-06'),
                type: 'sub',
                amount: '1100',
              },
              {
                time: new Date('2024-01-04'),
                type: 'sub',
                amount: '1200',
              },
            ],
          },
        ],
      },
    ];

    expect(groupData).toEqual(result);
  });
});
