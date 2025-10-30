import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { FilterDto } from './dto/filter.dto';
export declare class ContractController {
    private readonly contractsService;
    constructor(contractsService: ContractService);
    findAllContracts(filter: FilterDto): Promise<import("./dto/response.dto").PaginatedContractsResponseDto>;
    findContractById(id: string): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    createContract(body: CreateContractDto): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    deleteContract(id: string): Promise<import("./dto/response.dto").ResponseContractsDto>;
    resendSignatureEmail(id: string): Promise<{
        message: string;
    }>;
    getContractForSignature(id: string, token: string): Promise<{
        motorcycle: {
            id: string;
            status: import(".prisma/client").$Enums.StatusMotorcycle;
            observacao: string | null;
            created_at: Date | null;
            updated_at: Date | null;
            nome: string;
            cor: string;
            placa: string;
            ano: Date;
            chassi: string;
            renavam: string;
            km: string;
            valor_compra: number;
            valor_venda: number;
            valor_fipe: number;
            foto1: string | null;
            foto2: string | null;
            foto3: string | null;
        };
        client: {
            id: string;
            status: import(".prisma/client").$Enums.StatusClient;
            created_at: Date | null;
            updated_at: Date | null;
            tipo: import(".prisma/client").$Enums.TipoCliente;
            fullName: string;
            documento: string;
            telefone: string | null;
            email: string;
            dataNascimento: Date | null;
            companyName: string | null;
            cep: string;
            rua: string;
            numero: string;
            bairro: string;
            cidade: string;
            estado: string;
            complementos: string | null;
        };
    } & {
        id: string;
        valor: number;
        data: Date;
        status: import(".prisma/client").$Enums.StatusContrato;
        observacao: string | null;
        pagamento: import(".prisma/client").$Enums.Pagamento;
        contractoPdf: string | null;
        signatures: import("@prisma/client/runtime/library").JsonValue | null;
        signatureToken: string | null;
        signatureTokenExpiry: Date | null;
        created_at: Date | null;
        updated_at: Date | null;
        motorcycleId: string;
        clientId: string;
    }>;
    signContract(id: string, token: string, signatureData: any): Promise<{
        message: string;
        contract: {
            id: string;
            valor: number;
            data: Date;
            status: import(".prisma/client").$Enums.StatusContrato;
            observacao: string | null;
            pagamento: import(".prisma/client").$Enums.Pagamento;
            contractoPdf: string | null;
            motorcycleId: string;
            motorcycle: {
                id: string;
                nome: string;
                placa: string;
                ano: Date;
                chassi: string;
                renavam: string;
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
        };
    }>;
}
