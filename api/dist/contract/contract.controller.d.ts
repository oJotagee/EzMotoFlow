import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { FilterDto } from './dto/filter.dto';
export declare class ContractController {
    private readonly contractsService;
    constructor(contractsService: ContractService);
    fintAllContract(Filter: FilterDto): Promise<import("./dto/response.dto").ResponseAllContractsDto[]>;
    findContractId(id: string): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    CreateContract(body: CreateContractDto): Promise<import("./dto/response.dto").ResponseAllContractsDto>;
    DeleteContract(id: string): Promise<import("./dto/response.dto").ResponseContractsDto>;
}
