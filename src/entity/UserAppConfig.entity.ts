import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';

@Entity()
export class UserAppConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isDisplayAmount?: boolean;

  @Column({ type: 'boolean', default: false })
  isDisplayAmountSwitch?: boolean;

  @Column({ type: 'boolean', default: false })
  isOpenSoundEffect?: boolean;

  @OneToOne(() => User, 'userAppConfig')
  @JoinColumn()
  user: User;
}
