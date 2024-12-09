import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecordEntity } from './record.entity';
import { UserEntity } from './user.entity';
import { BudgetEntity } from './budget.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'varchar' })
  icon: string;

  @Column({ type: 'enum', enum: ['add', 'sub'] })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('user', 'category')
  user: UserEntity;

  @OneToMany('record', 'category')
  records: RecordEntity[];

  @OneToMany('budget', 'category')
  budget: BudgetEntity[];
}
