export enum DateColumnOptionsType {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export function getDateColumnConfig(options: { type: DateColumnOptionsType }) {
  const { type } = options;

  return {
    type: 'timestamptz',
    comment: `${
      type === DateColumnOptionsType.CREATED_AT ? '创建时间' : '更新时间'
    }`,
  } as const;
}

export * from './BaseColumn';
