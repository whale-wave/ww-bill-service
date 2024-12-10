import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';
import { UserNotifyEntity } from './user-notify.entity';

export enum SystemNotifyEntityType {
  SYSTEM = 0,
  VERSION = 1,
}

@Entity('system_notify')
export class SystemNotifyEntity extends BaseColumn {
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

  @ManyToOne('user', 'systemNotifies')
  user: UserEntity;

  @OneToMany('user_notify', 'systemNotify')
  userNotifies: UserNotifyEntity[];
}
