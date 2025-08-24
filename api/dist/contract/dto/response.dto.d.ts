export declare class ResponseAllContractsDto {
    id: string;
    valor: number;
    data: Date;
    observacao: string | null;
    pagamento: string;
    contractoPdf: string | null;
    status: string;
    motorcycle: {
        placa: string;
        renavam: string;
        id: string;
        nome: string;
        ano: Date;
        chassi: string;
    };
    client: {
        id: string;
        fullName: string;
        documento: string;
        telefone: string | null;
        email: string;
        dataNascimento: Date | null;
        companyName: string | null;
    };
}
export declare class ResponseContractsDto {
    message: string;
}
