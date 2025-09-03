import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { MotorcycleService } from './motorcycle.service';
import { FilterDto } from './dto/filter.dto';
export declare class MotorcycleController {
    private readonly motorcycleService;
    constructor(motorcycleService: MotorcycleService);
    findAllMotorcycles(filter: FilterDto): Promise<import("./dto/response.dto").PaginatedMotorcyclesResponseDto>;
    findMotorcycleById(id: string): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    createMotorcycle(body: CreateMotorCycleDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    updateMotorcycle(id: string, body: UpdateMotorcycleDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto>;
    deleteMotorcycle(id: string): Promise<import("./dto/response.dto").ResponseMotorcycleDto>;
}
