import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';

// 资产 负债 净资产
export enum AssetStatisticalRecordType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  NET_ASSET = 'net_asset',
}

@Entity('asset_statistical_record')
export class AssetStatisticalRecord extends BaseColumn {
  @Column({
    type: 'varchar',
    comment: '类型',
    nullable: false,
  })
  type: AssetStatisticalRecordType;

  @Column({
    type: 'varchar',
    comment: '金额',
    nullable: false,
  })
  amount: string;

  @ManyToOne('user', 'assetStatisticalRecords')
  user: UserEntity;
}
