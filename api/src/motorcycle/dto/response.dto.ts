export class ResponseAllMotorcycleDto {
  id: string;
  cor: string;
  placa: string;
  ano: Date;
  chassi: string;
  renavam: string;
  km: string;
  valor_compra: number;
  valor_venda:  number;
  valor_fipe:   number;
  observacao: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export class ResponseMotorcycleDto {
	message: string;
}