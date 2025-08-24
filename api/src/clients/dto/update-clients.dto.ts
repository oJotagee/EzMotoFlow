import { CreateClientDto } from './create-clients.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateClientsDto extends PartialType(CreateClientDto) {}
