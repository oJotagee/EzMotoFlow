import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { Type } from 'class-transformer';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsIn(['ativo', 'inativo', 'vendido', 'andamento'])
	status?: 'ativo' | 'inativo' | 'vendido' | 'andamento';

	@IsOptional()
	@IsString()
	placa?: string;

	@IsOptional()
	@IsString()
	nome?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	anoMin?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	anoMax?: number;
}
