import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Pagamento {
	boleto = 'boleto',
	cartao = 'cartao',
	pix = 'pix',
}

export class CreateContractDto {
	@IsString()
	@IsOptional()
	readonly observacao?: string;

	@IsEnum(Pagamento)
	@IsNotEmpty()
	readonly pagamento: Pagamento;

	@IsString()
	@IsNotEmpty()
	readonly motorcycleId: string;

	@IsString()
	@IsNotEmpty()
	readonly clientId: string;

	@IsString()
	@IsOptional()
	readonly contractoPdf?: string;

	@IsOptional()
	readonly signatures?: any[];
}
