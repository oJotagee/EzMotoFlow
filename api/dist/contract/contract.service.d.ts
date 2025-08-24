import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
import { ResponseAllContractsDto, ResponseContractsDto } from './dto/response.dto';
export declare class ContractService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAll(filter: FilterDto): Promise<ResponseAllContractsDto[]>;
    getOne(id: string): Promise<ResponseAllContractsDto>;
    createOne(body: CreateContractDto): Promise<ResponseAllContractsDto>;
    deleteOne(id: string): Promise<ResponseContractsDto>;
}
