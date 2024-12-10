import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';
import { SystemNotifyEntity } from './system-notify.entity';

@Entity('user_notify')
export class UserNotifyEntity extends BaseColumn {
  @Column({ type: 'boolean', default: false })
  isRead?: boolean;

  @ManyToOne('system_notify', 'userNotifies')
  systemNotify: SystemNotifyEntity;

  @ManyToOne('user', 'userNotifies')
  user: UserEntity;
}
