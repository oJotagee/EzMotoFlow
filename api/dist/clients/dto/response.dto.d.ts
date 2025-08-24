export declare class ResponseAllClientsDto {
    id: string;
    tipo: string;
    fullName: string;
    documento: string;
    telefone: string | null;
    email: string;
    dataNascimento: Date | null;
    companyName: string | null;
    status: string;
}
export declare class ResponseClientDto {
    id: string;
    tipo: string;
    fullName: string;
    documento: string;
    telefone: string | null;
    email: string;
    dataNascimento: Date | null;
    companyName: string | null;
    status: string;
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complementos: string | null;
}
export declare class ResponseClientsDto {
    message: string;
}
