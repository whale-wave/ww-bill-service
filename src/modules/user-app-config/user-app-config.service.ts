import { Injectable } from '@nestjs/common';
import { DeepPartial, FindConditions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAppConfig } from '../../entity/UserAppConfig.entity';

@Injectable()
export class UserAppConfigService {
  constructor(
    @InjectRepository(UserAppConfig)
    private readonly userAppConfigRepository: Repository<UserAppConfig>,
  ) {
  }

  create(userAppConfig: DeepPartial<UserAppConfig>) {
    return this.userAppConfigRepository.save(userAppConfig);
  }

  findAll() {
    return `This action returns all userAppConfig`;
  }

  findOne(options: FindOneOptions<UserAppConfig>) {
    return this.userAppConfigRepository.findOne(options);
  }

  update(options: FindConditions<UserAppConfig>, userAppConfig: DeepPartial<UserAppConfig>) {
    return this.userAppConfigRepository.update(options, userAppConfig);
  }

  remove(id: number) {
    return `This action removes a #${id} userAppConfig`;
  }
}
