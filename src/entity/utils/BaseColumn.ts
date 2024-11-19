import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DateColumnOptionsType, getDateColumnConfig } from './index';

export class BaseColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn(getDateColumnConfig({ type: DateColumnOptionsType.CREATED_AT }))
  createdAt: Date;

  @UpdateDateColumn(getDateColumnConfig({ type: DateColumnOptionsType.UPDATED_AT }))
  updatedAt: Date;
}
