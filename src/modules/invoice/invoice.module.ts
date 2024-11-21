import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../entity';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
})
export class InvoiceModule {}
