import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsIn(['ativo', 'inativo'])
  status?: 'ativo' | 'inativo';

  @IsOptional()
  @IsString()
  nome?: string;
}