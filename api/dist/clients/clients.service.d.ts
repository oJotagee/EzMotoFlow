import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
import { ResponseAllClientsDto, ResponseClientDto, ResponseClientsDto, PaginatedClientsResponseDto } from './dto/response.dto';
export declare class ClientsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAll(filter: FilterDto): Promise<PaginatedClientsResponseDto>;
    getOne(id: string): Promise<ResponseClientDto>;
    createOne(body: CreateClientDto): Promise<ResponseAllClientsDto>;
    updateOne(id: string, body: UpdateClientsDto): Promise<ResponseAllClientsDto>;
    deleteOne(id: string): Promise<ResponseClientsDto>;
}
