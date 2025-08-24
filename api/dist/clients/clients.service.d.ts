import { ResponseAllClientsDto, ResponseClientDto, ResponseClientsDto } from './dto/response.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
export declare class ClientsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAll(filter: FilterDto): Promise<ResponseAllClientsDto[]>;
    getOne(id: string): Promise<ResponseClientDto>;
    createOne(body: CreateClientDto): Promise<ResponseAllClientsDto>;
    updateOne(id: string, body: UpdateClientsDto): Promise<ResponseAllClientsDto>;
    deleteOne(id: string): Promise<ResponseClientsDto>;
}
