export class ResponseAllMotorcycleDto {
	id: string;
	cor: string;
	placa: string;
	ano: Date;
	chassi: string;
	renavam: string;
	km: string;
	valor_compra: number;
	valor_venda: number;
	valor_fipe: number;
	observacao: string | null;
	status: string;
	created_at: Date | null;
	updated_at: Date | null;
}

export class ResponseMotorcycleDto {
	message: string;
}

export class PaginatedMotorcyclesResponseDto {
	data: ResponseAllMotorcycleDto[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}
