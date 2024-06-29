import { Injectable } from '@nestjs/common';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from '../../entity/Invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
  }

  create(invoice: DeepPartial<Invoice>) {
    return this.invoiceRepository.save(invoice);
  }

  findAll(options: FindManyOptions<Invoice>) {
    return this.invoiceRepository.find(options);
  }

  findOne(options: FindOneOptions<Invoice>) {
    return this.invoiceRepository.findOne(options);
  }

  update(options: FindConditions<Invoice>, updateInvoice: DeepPartial<Invoice>) {
    return this.invoiceRepository.update(options, updateInvoice);
  }

  remove(options: FindConditions<Invoice>) {
    return this.invoiceRepository.delete(options);
  }
}
