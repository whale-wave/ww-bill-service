import { defaultCategoryExpend, defaultCategoryIncome } from '../constant';

export interface CategoryRecord {
  name: string;
  icon: string;
  type: 'sub' | 'add';
  user: string | number;
}

export function createDefaultCategoryExpend(userId: string | number) {
  return defaultCategoryExpend.map((category) => {
    return {
      ...category,
      user: userId,
      type: 'sub',
    } as CategoryRecord;
  });
}

export function createDefaultCategoryIncome(userId: string | number) {
  return defaultCategoryIncome.map((category) => {
    return {
      ...category,
      user: userId,
      type: 'add',
    } as CategoryRecord;
  });
}

export function createDefaultCategory(userId: string | number) {
  return [
    ...createDefaultCategoryExpend(userId),
    ...createDefaultCategoryIncome(userId),
  ];
}
