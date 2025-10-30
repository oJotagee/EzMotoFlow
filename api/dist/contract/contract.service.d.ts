import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/mail/mail.service';
import { FilterDto } from './dto/filter.dto';
import { ResponseAllContractsDto, ResponseContractsDto, PaginatedContractsResponseDto } from './dto/response.dto';
export declare class ContractService {
    private prismaService;
    private emailService;
    constructor(prismaService: PrismaService, emailService: EmailService);
    getAll(filter: FilterDto): Promise<PaginatedContractsResponseDto>;
    getOne(id: string): Promise<ResponseAllContractsDto>;
    createOne(body: CreateContractDto): Promise<ResponseAllContractsDto>;
    deleteOne(id: string): Promise<ResponseContractsDto>;
    resendSignatureEmail(contractId: string): Promise<{
        message: string;
    }>;
    getContractForSignature(contractId: string, token: string): Promise<{
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
    signContract(contractId: string, token: string, signatureData: any): Promise<{
        message: string;
        contract: {
            id: string;
            valor: number;
            motorcycleId: string;
        };
    }>;
}
