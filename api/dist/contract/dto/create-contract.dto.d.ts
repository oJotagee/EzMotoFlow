export declare enum Pagamento {
    boleto = "boleto",
    cartao = "cartao",
    pix = "pix"
}
export declare class CreateContractDto {
    readonly observacao?: string;
    readonly pagamento: Pagamento;
    readonly motorcycleId: string;
    readonly clientId: string;
}
