import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService],
  exports: [ToolsService],
  imports: [UserModule],
})
export class ToolsModule {}
