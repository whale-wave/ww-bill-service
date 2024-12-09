import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseColumn } from './utils';

@Entity('invoice')
export class InvoiceEntity extends BaseColumn {
  @Column({
    type: 'varchar',
    nullable: false,
    comment: '公司名称',
  })
  companyName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '税号',
  })
  taxNumber: string;

  @Column({
    type: 'varchar',
    comment: '单位地址',
    default: '',
  })
  companyAddress?: string;

  @Column({
    type: 'varchar',
    comment: '电话号码',
    default: '',
  })
  phone?: string;

  @Column({
    type: 'varchar',
    comment: '开户银行',
    default: '',
  })
  accountOpeningBank?: string;

  @Column({
    type: 'varchar',
    comment: '银行账号',
    default: '',
  })
  bankAccount?: string;

  @ManyToOne('user', 'id')
  user: UserEntity;
}
