import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { UserNotifyEntity } from './user-notify.entity';

export enum SystemNotifyEntityType {
  SYSTEM = 0,
  VERSION = 1,
}

@Entity('system_notify')
export class SystemNotifyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  type: SystemNotifyEntityType;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  coverPicture?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isBroadcast: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne('user', 'systemNotifies')
  user: UserEntity;

  @OneToMany('user_notify', 'systemNotify')
  userNotifies: UserNotifyEntity[];
}
