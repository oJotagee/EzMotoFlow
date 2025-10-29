import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { FilterDto } from './dto/filter.dto';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

@Controller('contract')
export class ContractController {
	constructor(private readonly contractsService: ContractService) {}

	@Get()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Get all contracts with pagination' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of contracts to fetch (max 10)',
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		example: 0,
		description: 'Number of contracts to skip',
	})
	@ApiQuery({
		name: 'status',
		required: false,
		example: '',
		description:
			'Filter by contract status: "ativo", "cancelado" or "finalizado"',
	})
	@ApiQuery({
		name: 'nomeCliente',
		required: false,
		example: '',
		description: 'Filter by client name',
	})
	@ApiQuery({
		name: 'documentoCliente',
		required: false,
		example: '',
		description: 'Filter by client document',
	})
	@ApiQuery({
		name: 'placa',
		required: false,
		example: '',
		description: 'Filter by motorcycle plate',
	})
	@ApiQuery({
		name: 'renavam',
		required: false,
		example: '',
		description: 'Filter by motorcycle renavam',
	})
	@ApiQuery({
		name: 'dataInicio',
		required: false,
		example: 2017,
		description: 'Filter by start year (inclusive)',
	})
	@ApiQuery({
		name: 'dataFim',
		required: false,
		example: 2025,
		description: 'Filter by end year (inclusive)',
	})
	findAllContracts(@Query() filter: FilterDto) {
		return this.contractsService.getAll(filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a contract by ID' })
	@ApiQuery({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Contract identifier',
	})
	findContractById(@Query('id') id: string) {
		return this.contractsService.getOne(id);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Create a new contract' })
	createContract(@Body() body: CreateContractDto) {
		return this.contractsService.createOne(body);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Delete a contract' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Contract identifier',
	})
	deleteContract(@Param('id') id: string) {
		return this.contractsService.deleteOne(id);
	}
}
