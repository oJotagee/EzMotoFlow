import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsIn(['ativo', 'inativo'])
	status?: 'ativo' | 'inativo';

	@IsOptional()
	@IsString()
	placa?: string;
}
