import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Entity('record')
export class RecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  remark: string;

  @Column({ type: 'timestamp' })
  time: string;

  @Column({ nullable: false, enum: ['sub', 'add'] })
  type: string;

  @Column({ nullable: false })
  amount: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('user', 'records')
  user: UserEntity;

  @ManyToOne('category', 'records')
  category: CategoryEntity;
}
