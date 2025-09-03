import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { FilterDto } from './dto/filter.dto';
export declare class ContractController {
    private readonly contractsService;
    constructor(contractsService: ContractService);
    findAllContracts(filter: FilterDto): Promise<import("./dto/response.dto").PaginatedContractsResponseDto>;
    findContractById(id: string): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    createContract(body: CreateContractDto): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    deleteContract(id: string): Promise<import("./dto/response.dto").ResponseContractsDto>;
}
