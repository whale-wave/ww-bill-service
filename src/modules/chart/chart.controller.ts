import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ChartService } from './chart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetChartDataDto } from './dto/get-chart-data.dto';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiTags('chart')
  @ApiOperation({ summary: '获取图表数据' })
  @ApiBearerAuth('Token')
  getChartData(@Req() req, @Query() getChartDataDto: GetChartDataDto) {
    return this.chartService.getChartData(+req.user.id, getChartDataDto);
  }
}
