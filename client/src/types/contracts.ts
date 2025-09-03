export enum ContractStatus {
  ATIVO = 'ativo',
  CANCELADO = 'cancelado',
  FINALIZADO = 'finalizado'
}

export enum PaymentMethod {
  BOLETO = 'boleto',
  CARTAO = 'cartao',
  PIX = 'pix'
}

export interface Contract {
  id: string;
  valor: number;
  data: string;
  status: ContractStatus;
  observacao?: string;
  pagamento: PaymentMethod;
  contractoPdf?: string;
  created_at: string;
  updated_at: string;
  motorcycleId: string;
  clientId: string;
  // Relations
  motorcycle?: import('./motorcycles').Motorcycle;
  client?: import('./clients').Client;
}

export interface ContractFilters {
  nomeCliente?: string;
  documentoCliente?: string;
  placa?: string;
  renavam?: string;
  status?: ContractStatus;
  pagamento?: PaymentMethod;
  dataInicio?: string;
  dataFim?: string;
  limit?: number;
  offset?: number;
}
