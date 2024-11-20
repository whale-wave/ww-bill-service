import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';
import { BaseColumn } from './utils';
import { AssetEntity } from './asset.entity';

@Entity('asset_record')
export class AssetRecordEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产操作名',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产操作类型',
    nullable: false,
  })
  type: string;

  @Column({
    enum: ['sub', 'add'],
    comment: '资产操作备注',
    nullable: false,
  })
  comment: string;

  @Column({
    type: 'varchar',
    comment: '资产操作金额',
    nullable: false,
  })
  amount: string;

  @ManyToOne('asset', 'id')
  asset: AssetEntity;

  @ManyToOne('User', 'id')
  user: User;
}
