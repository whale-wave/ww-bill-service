import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('check_in')
export class CheckInEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamptz')
  checkInTime: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('user', 'checkIns')
  user: UserEntity;
}
