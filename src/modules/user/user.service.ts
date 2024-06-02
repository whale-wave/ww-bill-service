import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDefaultCategory } from 'src/utils/createDefaultCategory';
import { DeepPartial, Repository } from 'typeorm';
import { throwFail } from '../../utils';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async createDefaultCategory(userId: string) {
    const user = await this.usersRepository.findOne(userId);
    if (!user) throwFail('用户不存在');
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
}
