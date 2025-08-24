import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { FilterDto } from './dto/filter.dto';
import { ResponseAllMotorcycleDto, ResponseMotorcycleDto } from './dto/response.dto';
export declare class MotorcycleService {
    private prismaService;
    private s3Service;
    constructor(prismaService: PrismaService, s3Service: AwsS3Service);
    getAll(filter: FilterDto): Promise<ResponseAllMotorcycleDto[]>;
    getOne(id: string): Promise<ResponseAllMotorcycleDto>;
    createOne(body: CreateMotorCycleDto): Promise<ResponseAllMotorcycleDto>;
    updateOne(id: string, body: UpdateMotorcycleDto): Promise<ResponseAllMotorcycleDto>;
    deleteOne(id: string): Promise<ResponseMotorcycleDto>;
}
