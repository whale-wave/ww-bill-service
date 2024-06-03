import { Injectable } from '@nestjs/common';
import { CreateUserEmailDto } from './dto/create-user-email.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

@Injectable()
export class UserEmailService {
  create(createUserEmailDto: CreateUserEmailDto) {
    return 'This action adds a new userEmail';
  }

  findAll() {
    return `This action returns all userEmail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userEmail`;
  }

  update(id: number, updateUserEmailDto: UpdateUserEmailDto) {
    return `This action updates a #${id} userEmail`;
  }

  remove(id: number) {
    return `This action removes a #${id} userEmail`;
  }
}
