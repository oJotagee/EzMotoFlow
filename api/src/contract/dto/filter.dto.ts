import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { Type } from 'class-transformer';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsIn(['ativo', 'cancelado', 'finalizado'])
	status?: 'ativo' | 'cancelado' | 'finalizado';

	@IsOptional()
	@IsString()
	nomeCliente?: string;

	@IsOptional()
	@IsString()
	documentoCliente?: string;

	@IsOptional()
	@IsString()
	placa?: string;

	@IsOptional()
	@IsString()
	renavam?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	dataInicio?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	dataFim?: number;
}
