import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RESPONSE_STATUS_CODE,
  created,
  deleted,
  fail,
  sendError,
  sendSuccess,
  success,
  updated,
} from '../../utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateRecordDto,
  GetRecordListDto,
  UpdateRecordDto,
} from './dto/record.dto';
import { RecordService } from './record.service';
import { GetRecordBillDto } from './dto/GetRecordBillDto';
import { FindOneParamDto } from './dto/find-one-param.dto';

@ApiTags('record')
@UseGuards(JwtAuthGuard)
@Controller('record')
@ApiBearerAuth('Token')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  @ApiOperation({ summary: '明细页数据' })
  async findAll(@Req() req: any, @Query() query: GetRecordListDto) {
    const data = await this.recordService.findAllByUserIdAndParams(+req.user.id, query);
    return success(data);
  }

  @Post()
  @ApiOperation({ summary: '添加记录' })
  async create(@Req() req: any, @Body() body: CreateRecordDto) {
    await this.recordService.create(+req.user.id, body);
    return created();
  }

  @Put(':id')
  @ApiOperation({ summary: '更新记录' })
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    await this.recordService.update(+id, updateRecordDto);
    return updated();
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除记录' })
  async remove(@Param('id') id: string) {
    await this.recordService.remove(+id);
    return deleted();
  }

  @Post('import_data')
  @ApiOperation({ summary: '导入数据' })
  @UseInterceptors(FileInterceptor('file'))
  async importData(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file)
      return fail('请上传 excel 文件，用于导入数据');
    if (!file.mimetype.includes('sheet'))
      return fail('只支持 xlsx 格式文件');
    const res = await this.recordService.importData(file.buffer, req.user.id);
    return success(res, '导入成功');
  }

  @Get('bill')
  @ApiOperation({ summary: '获取账单数据' })
  async getBill(@Req() req: any, @Query() query: GetRecordBillDto) {
    const { type, year } = query;
    const res = await this.recordService.getBill(req.user.id, type, year);
    return success(res, '获取成功');
  }

  @Get(':id')
  @ApiOperation({ summary: '记录详情' })
  async findOne(
    @Req() req: any,
    @Param() findOneParamDto: FindOneParamDto,
  ) {
    const data = await this.recordService.findOne({
      where: {
        user: req.user.id,
        id: findOneParamDto.id,
      },
      relations: ['category'],
    });
    if (!data) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NO_FOUND_DATA });
    }
    return sendSuccess({ data });
  }
}
