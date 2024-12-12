import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';
import { AssetEntity } from './asset.entity';

export enum AssetGroupAssetType {
  NORMAL = 'normal',
  CREDIT = 'credit',
  BANK = 'bank',
}

export enum AssetGroupType {
  ADD = 'add',
  SUB = 'sub',
}

@Entity('asset_group')
export class AssetGroupEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产组名',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产组图标',
    nullable: false,
  })
  icon: string;

  @Column({
    type: 'varchar',
    comment: '资产组描述',
    default: '',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'int',
    comment: '资产组层级',
    default: 0,
    nullable: false,
  })
  level: number;

  @Column({
    type: 'int',
    comment: '资产组排序',
    default: 0,
    nullable: false,
  })
  order: number;

  @Column({
    type: 'varchar',
    comment: '资产组类型',
    nullable: false,
    default: AssetGroupAssetType.NORMAL,
  })
  assetType: AssetGroupAssetType;

  @Column({
    type: 'varchar',
    comment: '资产金额类型',
    nullable: false,
    default: AssetGroupType.ADD,
  })
  type: AssetGroupType;

  @Column({
    type: 'boolean',
    comment: '资产组修正名',
    nullable: false,
    default: false,
  })
  fixedName: boolean;

  @Column({
    type: 'varchar',
    comment: '父级资产组ID',
    nullable: true,
  })
  parentId: string;

  @ManyToOne('user', 'id')
  user: UserEntity;

  @OneToMany('asset', 'assetGroup')
  asset: AssetEntity[];
}
