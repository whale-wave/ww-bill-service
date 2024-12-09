import * as dayjs from 'dayjs';
import { mathHelper } from '../../../utils';
import { RecordType } from '../../../types';
import { RecordEntity } from '../../../entity';

export function calcRecordListAmount(recordList: RecordEntity[]) {
  const { income, expand } = recordList.reduce(
    (res, i) => {
      if (i.type === RecordType.EXPEND) {
        res.expand = mathHelper.add(res.expand, i.amount).toNumber();
      }
      else if (i.type === RecordType.INCOME) {
        res.income = mathHelper.add(res.income, i.amount).toNumber();
      }
      return res;
    },
    { income: 0, expand: 0 },
  );
  return {
    income,
    expand,
    balance: mathHelper.subtract(income, expand).toNumber(),
  };
}

export function calcEachMonthAmount(data: any) {
  const monthList = {};
  data.forEach((i: any) => {
    const month = dayjs(i.time).month() + 1;
    if (!(month in monthList))
      monthList[month] = [];
    monthList[month].push([i.type, i.amount]);
  });

  const totalYearAmount = { expand: 0, income: 0, balance: 0 } as BillItem;

  const eachMonthAmount = Object.keys(monthList).reduce((pre, cur) => {
    pre[cur] = monthList[cur].reduce(
      (res, [type, amount]) => {
        if (type === RecordType.EXPEND) {
          res.expand = mathHelper.add(res.expand, amount).toNumber();
        }
        else if (type === RecordType.INCOME) {
          res.income = mathHelper.add(res.income, amount).toNumber();
        }
        return res;
      },
      { income: 0, expand: 0 },
    );
    pre[cur].balance = mathHelper
      .subtract(pre[cur].income, pre[cur].expand)
      .toNumber();

    // Calculate the total bill
    totalYearAmount.income = mathHelper
      .add(pre[cur].income, totalYearAmount.income)
      .toNumber();
    totalYearAmount.expand = mathHelper
      .add(pre[cur].expand, totalYearAmount.expand)
      .toNumber();
    totalYearAmount.balance = mathHelper
      .add(pre[cur].balance, totalYearAmount.balance)
      .toNumber();
    return pre;
  }, {} as { [month: string]: BillItem });

  return {
    list: eachMonthAmount,
    all: totalYearAmount,
  };
}

export interface BillItem {
  income: number;
  expand: number;
  balance: number;
}
