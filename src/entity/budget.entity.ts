import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { BaseColumn } from './utils';

export enum BudgetEntityType {
  MONTH = 0,
  YEAR = 1,
}

export enum BudgetEntityLevel {
  SUMMARY = 0,
  CATEGORY = 1,
}

@Entity('budget')
export class BudgetEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '预算金额',
    nullable: false,
  })
  amount: string;

  @Column({
    type: 'int',
    comment: '预算层级级别',
    nullable: false,
  })
  level: BudgetEntityLevel;

  @Column({
    type: 'int',
    comment: '预算类型',
    nullable: false,
  })
  type: BudgetEntityType;

  @ManyToOne('user', 'id')
  user: UserEntity;

  @ManyToOne('category', 'id', { nullable: true })
  category: CategoryEntity;
}
