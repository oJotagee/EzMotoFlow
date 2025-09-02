import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsIn(['ativo', 'inativo'])
	status?: 'ativo' | 'inativo';

	@IsOptional()
	@IsIn(['PESSOA_FISICA', 'PESSOA_JURIDICA'])
	tipo?: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';

	@IsOptional()
	@IsString()
	nome?: string;
}
