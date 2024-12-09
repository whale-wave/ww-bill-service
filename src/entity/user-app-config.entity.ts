import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';

@Entity('user_app_config')
export class UserAppConfigEntity extends BaseColumn {
  @Column({ type: 'boolean', default: false })
  isDisplayAmount?: boolean;

  @Column({ type: 'boolean', default: false })
  isDisplayAmountSwitch?: boolean;

  @Column({ type: 'boolean', default: false })
  isOpenSoundEffect?: boolean;

  @OneToOne(() => UserEntity, 'userAppConfig')
  @JoinColumn()
  user: UserEntity;
}
