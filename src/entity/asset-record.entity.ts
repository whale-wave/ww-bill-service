import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';
import { BaseColumn } from './utils';
import { AssetEntity } from './asset.entity';

@Entity('asset_record')
export class AssetRecordEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产操作名',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产操作类型',
  })
  type: string;

  @Column({
    enum: ['sub', 'add'],
    comment: '资产操作备注',
  })
  comment: string;

  @Column({
    type: 'varchar',
    comment: '资产操作金额',
  })
  amount: string;

  @ManyToOne('Asset', 'id')
  asset: AssetEntity;

  @ManyToOne('User', 'id')
  user: User;
}
