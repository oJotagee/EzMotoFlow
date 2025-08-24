import { CreateMotorCycleDto } from './create-motorcycle.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMotorcycleDto extends PartialType(CreateMotorCycleDto) {}
