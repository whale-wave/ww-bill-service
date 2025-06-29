import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';
import { AssetGroupEntity } from './asset-group.entity';
import { AssetRecordEntity } from './asset-record.entity';

@Entity('asset')
export class AssetEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产名',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产备注',
    default: '',
    nullable: false,
  })
  comment?: string;

  @Column({
    type: 'varchar',
    comment: '资产剩余金额',
    nullable: false,
  })
  amount: string;

  @Column({
    type: 'varchar',
    comment: '卡号',
    nullable: false,
    default: '',
  })
  cardId?: string;

  @ManyToOne('asset_group', 'id')
  assetGroup: AssetGroupEntity;

  @ManyToOne('user', 'id')
  user: UserEntity;

  @OneToMany('asset_record', 'asset')
  assetRecord: AssetRecordEntity[];
}
