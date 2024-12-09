import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('system_notify')
export class SystemNotifyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @Column({ type: 'boolean', default: true })
  isGlobal?: boolean;

  // @Column({ type: 'boolean', default: false })
  // isShow?: boolean;

  @Column({ type: 'varchar', default: '' })
  coverPicture?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne('user', 'systemNotifies')
  user: UserEntity;
}
