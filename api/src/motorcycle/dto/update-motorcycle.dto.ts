import { PartialType } from '@nestjs/swagger';
import { CreateMotorCycleDto } from './create-motorcycle.dto';

export class UpdateMotorcycleDto extends PartialType(CreateMotorCycleDto) {}
