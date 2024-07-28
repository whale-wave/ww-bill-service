import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';
import { Category } from '../modules/category/entity/category.entity';

export enum BudgetEntityType {
  MONTH = 0,
  YEAR = 1,
}

export enum BudgetEntityLevel {
  SUMMARY = 0,
  CATEGORY = 1,
}

@Entity('budget')
export class BudgetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({
    type: 'timestamptz',
    comment: '创建时间',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    comment: '更新时间',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne('User', 'id')
  user: User;

  @ManyToOne('Category', 'id', { nullable: true })
  category: Category;
}
