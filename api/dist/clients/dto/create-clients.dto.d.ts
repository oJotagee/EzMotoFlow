export declare enum TipoCliente {
    PESSOA_FISICA = "PESSOA_FISICA",
    PESSOA_JURIDICA = "PESSOA_JURIDICA"
}
export declare class CreateClientDto {
    readonly tipo: TipoCliente;
    readonly fullName: string;
    readonly documento: string;
    readonly telefone?: string;
    readonly email: string;
    readonly dataNascimento?: string;
    readonly companyName?: string;
    readonly cep: string;
    readonly rua: string;
    readonly numero: string;
    readonly bairro: string;
    readonly cidade: string;
    readonly estado: string;
    readonly complementos?: string;
}
