import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../entity/category.entity';
import { UserEntity } from '../../entity/user.entity';
import { RecordEntity } from '../../entity/record.entity';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity, UserEntity, CategoryEntity])],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
