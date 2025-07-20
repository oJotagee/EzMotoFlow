import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAllMotorcycleDto } from './dto/response.dto';
export declare class MotorcycleService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAll(pagination: PaginationDto): Promise<ResponseAllMotorcycleDto[]>;
}
