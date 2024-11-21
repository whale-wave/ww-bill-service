import { Injectable } from '@nestjs/common';
import { DeepPartial, FindConditions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAppConfigEntity } from '../../entity';

@Injectable()
export class UserAppConfigService {
  constructor(
    @InjectRepository(UserAppConfigEntity)
    private readonly userAppConfigRepository: Repository<UserAppConfigEntity>,
  ) {
  }

  create(userAppConfig: DeepPartial<UserAppConfigEntity>) {
    return this.userAppConfigRepository.save(userAppConfig);
  }

  findAll() {
    return `This action returns all userAppConfig`;
  }

  findOne(options: FindOneOptions<UserAppConfigEntity>) {
    return this.userAppConfigRepository.findOne(options);
  }

  update(options: FindConditions<UserAppConfigEntity>, userAppConfig: DeepPartial<UserAppConfigEntity>) {
    return this.userAppConfigRepository.update(options, userAppConfig);
  }

  remove(id: number) {
    return `This action removes a #${id} userAppConfig`;
  }
}
