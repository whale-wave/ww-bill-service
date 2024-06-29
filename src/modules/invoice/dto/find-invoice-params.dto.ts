import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindInvoiceParamsDto {
  @ApiProperty({
    description: '发票ID',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
