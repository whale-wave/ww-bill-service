import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordEntity } from '../../entity/record.entity';
import { CategoryEntity } from '../../entity/category.entity';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';

@Module({
  controllers: [ChartController],
  providers: [ChartService],
  imports: [TypeOrmModule.forFeature([RecordEntity, CategoryEntity])],
})
export class ChartModule {}
