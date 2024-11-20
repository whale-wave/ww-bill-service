import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { CheckIn } from '../../check-in/entities/check-in.entity';
import { Follow } from '../../follow/entities/follow.entity';
import { Record } from '../../record/entity/record.entity';
import { SystemNotify } from '../../system-notify/entity/system-notify.entity';
import { Comment } from '../../topic/entty/comment.entity';
import { Topic, TopicLike } from '../../topic/entty/topic.entity';
import { UserAppConfig } from '../../../entity/UserAppConfig.entity';
import { Invoice } from '../../../entity/Invoice.entity';
import { BudgetEntity } from '../../../entity/budget.entity';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity } from '../../../entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '神奇海螺' })
  name?: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true, select: false })
  isActive?: boolean;

  @Column()
  email: string;

  @Column({
    default:
      'https://bill-rearend.oss-cn-guangzhou.aliyuncs.com/static/defulatAvatar.jpg',
  })
  avatar?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @OneToMany('Topic', 'user')
  topics?: Topic[];

  @OneToMany('TopicLike', 'user')
  topicLikes?: TopicLike[];

  @OneToMany('Record', 'user')
  records?: Record[];

  @OneToMany('Category', 'user')
  category?: Category[];

  @OneToMany('Comment', 'user')
  comments?: Comment[];

  @OneToMany('CheckIn', 'user')
  checkIns?: CheckIn[];

  @OneToMany('Follow', 'user')
  follows?: Follow[];

  @OneToMany('SystemNotify', 'user')
  systemNotifies?: SystemNotify[];

  @OneToOne('UserAppConfig', 'user')
  userAppConfig: UserAppConfig;

  @OneToMany('Invoice', 'user')
  invoice: Invoice[];

  @OneToMany('budget', 'user')
  budget: BudgetEntity[];

  @OneToMany('asset', 'user')
  asset: AssetEntity[];

  @OneToMany('asset_record', 'user')
  assetRecord: AssetRecordEntity[];

  @OneToMany('asset_group', 'user')
  assetGroup: AssetGroupEntity[];
}
