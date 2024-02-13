import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../record/entity/record.entity';

@Module({
  controllers: [ChartController],
  providers: [ChartService],
  imports: [TypeOrmModule.forFeature([Record])],
})
export class ChartModule {}
