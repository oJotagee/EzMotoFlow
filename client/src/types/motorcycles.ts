export enum MotorcycleStatus {
	ATIVO = 'ativo',
	INATIVO = 'inativo',
	VENDIDO = 'vendido',
	ANDAMENTO = 'andamento',
}

export interface Motorcycle {
	id: string;
	nome: string;
	cor: string;
	placa: string;
	ano: string;
	chassi: string;
	renavam: string;
	km: string;
	valor_compra: number;
	valor_venda: number;
	valor_fipe: number;
	observacao?: string;
	foto1?: string;
	foto2?: string;
	foto3?: string;
	status: MotorcycleStatus;
	created_at: string;
	updated_at: string;
}

export interface MotorcycleFilters {
	nome?: string;
	status?: MotorcycleStatus;
	cor?: string;
	ano?: string;
	anoMin?: string;
	anoMax?: string;
	limit?: number;
	offset?: number;
}
