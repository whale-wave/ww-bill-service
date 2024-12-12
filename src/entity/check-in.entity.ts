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

  @Column('timestamp')
  checkInTime: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('user', 'checkIns')
  user: UserEntity;
}
