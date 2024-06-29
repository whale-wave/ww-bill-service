import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindConditions } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RESPONSE_STATUS_CODE, sendError, sendSuccess } from '../../utils';
import { Invoice } from '../../entity/Invoice.entity';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { DeleteInvoiceParamsDto } from './dto/delete-invoice-params.dto';
import { UpdateInvoiceParamsDto } from './dto/update-invoice-params.dto';
import { FindInvoiceParamsDto } from './dto/find-invoice-params.dto';

@ApiTags('invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {
  }

  @ApiOperation({ summary: '创建发票' })
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {
    await this.invoiceService.create({
      ...createInvoiceDto,
      user: req.user.id,
    });

    return sendSuccess({ statusCode: RESPONSE_STATUS_CODE.CREATE_SUCCESS });
  }

  @ApiOperation({ summary: '获取所有发票' })
  @Get()
  async findAll(@Req() req: any) {
    const data = await this.invoiceService.findAll({
      where: {
        user: req.user.id,
      },
    });

    return sendSuccess({ statusCode: RESPONSE_STATUS_CODE.SUCCESS, data });
  }

  @ApiOperation({ summary: '获取单个发票' })
  @Get(':id')
  async findOne(@Param() params: FindInvoiceParamsDto, @Req() req: any) {
    const { id } = params;

    const data = await this.invoiceService.findOne({
      where: {
        id,
        user: req.user.id,
      },
    });

    if (!data) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NO_FOUND_DATA });
    }

    return sendSuccess({ statusCode: RESPONSE_STATUS_CODE.SUCCESS, data });
  }

  @ApiOperation({ summary: '更新发票' })
  @Patch(':id')
  async update(@Param() params: UpdateInvoiceParamsDto, @Body() updateInvoiceDto: UpdateInvoiceDto, @Req() req: any) {
    const { id } = params;

    if (!Object.keys(updateInvoiceDto).length) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.BODY_EMPTY });
    }

    const where = {
      id,
      user: req.user.id,
    } as FindConditions<Invoice>;

    const invoice = await this.invoiceService.findOne({
      where,
    });

    if (!invoice) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NO_FOUND_DATA });
    }

    await this.invoiceService.update({
      id,
      user: req.user.id,
    }, updateInvoiceDto);

    return sendSuccess({ statusCode: RESPONSE_STATUS_CODE.UPDATE_SUCCESS });
  }

  @ApiOperation({ summary: '删除发票' })
  @Delete(':id')
  async remove(@Param() params: DeleteInvoiceParamsDto, @Req() req: any) {
    const { id } = params;

    const where = {
      id,
      user: req.user.id,
    } as FindConditions<Invoice>;

    const invoice = await this.invoiceService.findOne({
      where,
    });

    if (!invoice) {
      return sendError({ statusCode: RESPONSE_STATUS_CODE.NO_FOUND_DATA });
    }

    await this.invoiceService.remove(where);

    return sendSuccess({ statusCode: RESPONSE_STATUS_CODE.DELETE_SUCCESS });
  }
}
