import { MotorcycleService } from './motorcycle.service';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class MotorcycleController {
    private readonly motorcycleService;
    constructor(motorcycleService: MotorcycleService);
    fintAllMotorcycle(Pagination: PaginationDto): Promise<import("./dto/response.dto").ResponseAllMotorcycleDto[]>;
}
