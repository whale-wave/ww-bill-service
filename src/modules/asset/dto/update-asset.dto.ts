import { PartialType } from '@nestjs/swagger';
import { CreateAssetDto } from './index';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
