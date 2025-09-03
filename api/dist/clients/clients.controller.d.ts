import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { ClientsService } from './clients.service';
import { FilterDto } from './dto/filter.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    findAllClients(filter: FilterDto): Promise<import("./dto/response.dto").PaginatedClientsResponseDto>;
    findClientById(id: string): Promise<import("./dto/response.dto").ResponseClientDto>;
    createClient(body: CreateClientDto): Promise<import("./dto/response.dto").ResponseAllClientsDto>;
    updateClient(id: string, body: UpdateClientsDto): Promise<import("./dto/response.dto").ResponseAllClientsDto>;
    deleteClient(id: string): Promise<import("./dto/response.dto").ResponseClientsDto>;
}
