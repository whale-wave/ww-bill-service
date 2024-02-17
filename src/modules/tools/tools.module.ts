import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService],
  exports: [ToolsService],
  imports: [UserModule],
})
export class ToolsModule {}
