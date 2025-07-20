import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsIn(['ativo', 'inativo'])
	status?: 'ativo' | 'inativo';

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
