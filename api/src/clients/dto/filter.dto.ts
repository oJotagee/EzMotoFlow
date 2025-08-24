import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsIn(['ativo', 'inativo'])
  status?: 'ativo' | 'inativo';

  @IsOptional()
  @IsString()
  nome?: string;
}