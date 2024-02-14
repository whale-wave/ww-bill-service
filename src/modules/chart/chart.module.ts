import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../record/entity/record.entity';
import { Category } from '../category/entity/category.entity';

@Module({
  controllers: [ChartController],
  providers: [ChartService],
  imports: [TypeOrmModule.forFeature([Record, Category])],
})
export class ChartModule {}
