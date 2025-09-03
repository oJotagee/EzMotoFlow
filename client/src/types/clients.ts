export enum ClientType {
  PESSOA_FISICA = 'PESSOA_FISICA',
  PESSOA_JURIDICA = 'PESSOA_JURIDICA'
}

export enum ClientStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo'
}

export interface Client {
  id: string;
  tipo: ClientType;
  fullName: string;
  documento: string;
  telefone?: string;
  email: string;
  dataNascimento?: string;
  companyName?: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complementos?: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export interface ClientFilters {
  nome?: string;
  tipo?: ClientType;
  status?: ClientStatus;
  limit?: number;
  offset?: number;
}
