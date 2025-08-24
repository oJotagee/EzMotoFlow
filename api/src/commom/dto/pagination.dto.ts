import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
	@IsOptional()
	@IsInt()
	@Min(6)
	@Max(10)
	@Type(() => Number)
	limit: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(6)
	@Type(() => Number)
	offset: number;
}
