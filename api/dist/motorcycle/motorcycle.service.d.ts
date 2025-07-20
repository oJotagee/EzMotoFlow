import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAllMotorcycleDto, ResponseMotorcycleDto } from './dto/response.dto';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
export declare class MotorcycleService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAll(pagination: PaginationDto): Promise<ResponseAllMotorcycleDto[]>;
    getOne(id: string): Promise<ResponseAllMotorcycleDto>;
    createOne(body: CreateMotorCycleDto): Promise<ResponseAllMotorcycleDto>;
    updateOne(id: string, body: UpdateMotorcycleDto): Promise<ResponseAllMotorcycleDto>;
    deleteOne(id: string): Promise<ResponseMotorcycleDto>;
}
