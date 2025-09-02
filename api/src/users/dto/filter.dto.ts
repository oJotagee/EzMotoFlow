import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterDto extends PaginationDto {
	@IsOptional()
	@IsString()
	nomeUser?: string;
}
