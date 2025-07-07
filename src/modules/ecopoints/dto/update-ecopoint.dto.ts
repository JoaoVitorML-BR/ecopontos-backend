import { PartialType } from '@nestjs/mapped-types';
import { CreateEcoPointDto } from './create-ecopoint.dto';

export class UpdateEcoPointDto extends PartialType(CreateEcoPointDto) {}
