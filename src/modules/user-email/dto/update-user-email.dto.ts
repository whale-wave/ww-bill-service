import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEmailDto } from './create-user-email.dto';

export class UpdateUserEmailDto extends PartialType(CreateUserEmailDto) {}
