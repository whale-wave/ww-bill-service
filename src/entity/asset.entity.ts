import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../modules/user/entity/user.entity';
import { BaseColumn } from './utils';
import { AssetGroupEntity } from './asset-group.entity';

@Entity('asset')
export class AssetEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产名',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产备注',
  })
  comment: string;

  @Column({
    type: 'varchar',
    comment: '资产图标',
  })
  icon: string;

  @Column({
    type: 'varchar',
    comment: '资产剩余金额',
  })
  amount: string;

  @ManyToOne('AssetGroup', 'id')
  assetGroup: AssetGroupEntity;

  @ManyToOne('User', 'id')
  user: User;
}
