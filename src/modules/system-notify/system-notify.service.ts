import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { throwFail } from '../../utils';
import { UserService } from '../user/user.service';
import { SystemNotifyEntity } from '../../entity/system-notify.entity';
import { CreateSystemNotifyDto } from './dto/system-notify.dto';

@Injectable()
export class SystemNotifyService {
  constructor(
    @InjectRepository(SystemNotifyEntity)
    private readonly systemNotifyRepository: Repository<SystemNotifyEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createSystemNotifyDto: CreateSystemNotifyDto) {
    const {
      content,
      isGlobal = true,
      coverPicture = '',
    } = createSystemNotifyDto;
    const systemNotify = new SystemNotifyEntity();
    const user = await this.userService.findOne(+userId);
    if (!user) {
      throwFail('用户不存在');
    }
    systemNotify.user = user;
    systemNotify.content = content;
    systemNotify.isGlobal = isGlobal;
    systemNotify.coverPicture = coverPicture;
    return this.systemNotifyRepository.save(systemNotify);
  }

  findAll() {
    return this.systemNotifyRepository.find({
      where: { isGlobal: true },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
