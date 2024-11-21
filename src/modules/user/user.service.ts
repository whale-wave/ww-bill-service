import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDefaultCategory } from 'src/utils/createDefaultCategory';
import { DeepPartial, Repository } from 'typeorm';
import { throwFail } from '../../utils';
import config from '../../config';
import { AssetService } from '../asset/asset.service';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AssetService))
    private assetService: AssetService,
  ) {}

  findOne(userId: number) {
    return this.usersRepository.findOne(userId);
  }

  findOneByUserName(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['password', 'id', 'username'],
    });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['password', 'id', 'username'],
    });
  }

  create(user: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  getUserInfo(id: number, select = []) {
    return this.usersRepository.findOne(id, {
      select: ['id', 'username', 'name', 'avatar', ...select],
    });
  }

  getUserInfoFullById(id: number) {
    return this.usersRepository.findOne(id);
  }

  updateBaseInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    const { name, avatar } = updateUserInfoDto;
    return this.usersRepository.update(id, { name, avatar });
  }

  updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { password, newPassword } = updatePasswordDto;
    return this.usersRepository.update(
      { id, password },
      { password: newPassword },
    );
  }

  async createDefaultCategory(userId: string | number) {
    const user = await this.usersRepository.findOne(userId);
    if (!user)
      throwFail('用户不存在');
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into('category')
      .values(createDefaultCategory(userId))
      .execute();
  }

  async updatePasswordByEmail(email: string, password: string) {
    return this.usersRepository.update({ email }, { password });
  }

  async update(filter: Record<string, any>, data: Partial<User>) {
    return this.usersRepository.update(filter, data);
  }

  async createSystemAdmin() {
    const { username, password } = config.defaultAdmin;

    if (!username || !password) {
      console.error('系统管理员配置错误，请检查 .env 文件');
      process.exit(1);
    };

    const SUPER_ADMIN_UUID = '550e8400-e29b-41d4-a716-446655440000';
    const user = await this.usersRepository.findOne({
      where: { uuid: SUPER_ADMIN_UUID },
    });

    let userId = user?.id;

    if (!user) {
      const result = await this.usersRepository.save({
        uuid: SUPER_ADMIN_UUID,
        name: '超级管理员',
        username,
        password,
        email: config.companyEmail,
        isSuperAdmin: true,
      });
      userId = result.id;
    }

    // TODO: 创建默认分类
    // await this.createDefaultCategory(userId);
    await this.assetService.createDefaultAssetGroup(userId);
  }

  getSystemUserInfo() {
    return this.usersRepository.findOne({
      where: { isSuperAdmin: true },
    });
  }
}
