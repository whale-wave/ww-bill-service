import { User } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseColumn } from './utils';
import { AssetEntity } from './asset.entity';

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
    type: 'varchar',
    comment: '父级资产组ID',
    nullable: true,
  })
  parentId: string;

  @OneToMany('asset', 'assetGroup')
  asset: AssetEntity[];

  @ManyToOne('User', 'id')
  user: User;
}
