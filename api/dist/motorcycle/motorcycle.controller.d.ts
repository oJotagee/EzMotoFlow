import { MotorcycleService } from './motorcycle.service';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
export declare class MotorcycleController {
    private readonly motorcycleService;
    constructor(motorcycleService: MotorcycleService);
    fintAllMotorcycle(Pagination: PaginationDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto[]>;
    findMotorcycleById(id: string): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    CreateMotorcycle(body: CreateMotorCycleDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    UpdatePost(id: string, body: UpdateMotorcycleDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    DeletePost(id: string): Promise<import("./dto/response.dto").ResponseMotorcycleDto>;
}
