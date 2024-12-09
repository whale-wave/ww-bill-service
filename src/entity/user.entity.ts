import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { SystemNotifyEntity } from './system-notify.entity';
import { RecordEntity } from './record.entity';
import { CommentEntity } from './comment.entity';
import { TopicEntity, TopicLikeEntity } from './topic.entity';
import { FollowEntity } from './follow.entity';
import { CheckInEntity } from './check-in.entity';
import { AssetStatisticalRecord } from './asset-statistical-record.entity';
import { AssetEntity, AssetGroupEntity, AssetRecordEntity, BudgetEntity, InvoiceEntity, UserAppConfigEntity } from '.';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  uuid?: string;

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

  @Column({ default: false, nullable: false })
  isSuperAdmin?: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany('topic', 'user')
  topics?: TopicEntity[];

  @OneToMany('topic_like', 'user')
  topicLikes?: TopicLikeEntity[];

  @OneToMany('record', 'user')
  records?: RecordEntity[];

  @OneToMany('category', 'user')
  category?: CategoryEntity[];

  @OneToMany('comment', 'user')
  comments?: CommentEntity[];

  @OneToMany('check_in', 'user')
  checkIns?: CheckInEntity[];

  @OneToMany('follow', 'user')
  follows?: FollowEntity[];

  @OneToMany('system_notify', 'user')
  systemNotifies?: SystemNotifyEntity[];

  @OneToOne('user_app_config', 'user')
  userAppConfig: UserAppConfigEntity;

  @OneToMany('invoice', 'user')
  invoice: InvoiceEntity[];

  @OneToMany('budget', 'user')
  budget: BudgetEntity[];

  @OneToMany('asset', 'user')
  asset: AssetEntity[];

  @OneToMany('asset_record', 'user')
  assetRecord: AssetRecordEntity[];

  @OneToMany('asset_group', 'user')
  assetGroup: AssetGroupEntity[];

  @OneToMany('asset_statistical_record', 'user')
  assetStatisticalRecords: AssetStatisticalRecord[];
}
