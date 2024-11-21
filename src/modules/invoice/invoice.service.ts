import { Injectable } from '@nestjs/common';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from '../../entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {
  }

  create(invoice: DeepPartial<InvoiceEntity>) {
    return this.invoiceRepository.save(invoice);
  }

  findAll(options: FindManyOptions<InvoiceEntity>) {
    return this.invoiceRepository.find(options);
  }

  findOne(options: FindOneOptions<InvoiceEntity>) {
    return this.invoiceRepository.findOne(options);
  }

  update(options: FindConditions<InvoiceEntity>, updateInvoice: DeepPartial<InvoiceEntity>) {
    return this.invoiceRepository.update(options, updateInvoice);
  }

  remove(options: FindConditions<InvoiceEntity>) {
    return this.invoiceRepository.delete(options);
  }
}
