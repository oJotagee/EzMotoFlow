import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { ClientsService } from './clients.service';
import { FilterDto } from './dto/filter.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    fintAllMotorcycle(Filter: FilterDto): Promise<import("./dto/response.dto").ResponseAllClientsDto[]>;
    findMotorcycleById(id: string): Promise<import("./dto/response.dto").ResponseClientDto>;
    CreateMotorcycle(body: CreateClientDto): Promise<import("./dto/response.dto").ResponseAllClientsDto>;
    UpdatePost(id: string, body: UpdateClientsDto): Promise<import("./dto/response.dto").ResponseAllClientsDto>;
    DeletePost(id: string): Promise<import("./dto/response.dto").ResponseClientsDto>;
}
