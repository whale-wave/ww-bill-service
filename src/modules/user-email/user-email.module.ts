import { Module } from '@nestjs/common';
import { UserEmailService } from './user-email.service';
import { UserEmailController } from './user-email.controller';
import { UserModule } from '../user/user.module';
import {ToolsModule} from "../tools/tools.module";

@Module({
  controllers: [UserEmailController],
  providers: [UserEmailService],
  imports: [UserModule, ToolsModule],
})
export class UserEmailModule {}
