import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { CreateUserEmailDto } from './dto/create-user-email.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

@Controller('user-email')
export class UserEmailController {
  constructor(private readonly userEmailService: UserEmailService) {}

  @Post()
  create(@Body() createUserEmailDto: CreateUserEmailDto) {
    return this.userEmailService.create(createUserEmailDto);
  }

  @Get()
  findAll() {
    return this.userEmailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userEmailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
  ) {
    return this.userEmailService.update(+id, updateUserEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userEmailService.remove(+id);
  }
}
