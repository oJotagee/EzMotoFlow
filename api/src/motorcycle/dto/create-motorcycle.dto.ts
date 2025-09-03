import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';

export class CreateMotorCycleDto {
	@IsString()
	@IsNotEmpty()
	readonly nome: string;

	@IsString()
	@IsNotEmpty()
	readonly cor: string;

	@IsString()
	@MaxLength(8)
	@IsNotEmpty()
	readonly placa: string;

	@IsNotEmpty()
	@IsDateString()
	readonly ano: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(17)
	readonly chassi: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(11)
	readonly renavam: string;

	@IsString()
	@IsNotEmpty()
	readonly km: string;

	@IsInt()
	@IsNotEmpty()
	readonly valor_compra: number;

	@IsInt()
	@IsNotEmpty()
	readonly valor_venda: number;

	@IsInt()
	@IsNotEmpty()
	readonly valor_fipe: number;

	@IsString()
	@IsOptional()
	readonly observacao: string;

	@IsOptional()
	@IsString()
	readonly foto1?: string;

	@IsOptional()
	@IsString()
	readonly foto2?: string;

	@IsOptional()
	@IsString()
	readonly foto3?: string;
}
