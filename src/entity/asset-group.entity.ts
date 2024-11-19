import { User } from 'src/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseColumn } from './utils';

@Entity('asset_group')
export class AssetGroupEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '资产组名',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '资产组图标',
  })
  icon: string;

  @ManyToOne('User', 'id')
  user: User;
}
