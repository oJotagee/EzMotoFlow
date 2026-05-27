import { PaginationDto } from '@api/commom/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  nomeUser?: string;
}
