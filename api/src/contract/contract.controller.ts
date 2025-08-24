import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractService } from './contract.service';
import { FilterDto } from './dto/filter.dto';
import {
	Body,
	Controller,
	Delete,
	Get,
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
	@ApiOperation({ summary: 'Get all contracts' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of contracts to fetch',
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
			'Filter by contacts status: "active", "canceled" or "finalized"',
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
		description: 'Filter by plate',
	})
	@ApiQuery({
		name: 'renavam',
		required: false,
		example: '',
		description: 'Filter by renavam',
	})
	@ApiQuery({
		name: 'dataInicio',
		required: false,
		example: 2017,
		description: 'Filtrar por ano da motocicleta (exato)',
	})
	@ApiQuery({
		name: 'dataFim',
		required: false,
		example: 2025,
		description: 'Filtrar por ano da motocicleta (exato)',
	})
	fintAllMotorcycle(@Query() Filter: FilterDto) {
		return this.contractsService.getAll(Filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a contract' })
	@ApiQuery({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Contract identifier',
	})
	findMotorcycleById(@Query('id') id: string) {
		return this.contractsService.getOne(id);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Create a contract' })
	CreateContract(@Body() body: CreateContractDto) {
		return this.contractsService.createOne(body);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Delete a contract' })
	@ApiQuery({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Contract identifier',
	})
	DeleteContract(@Query('id') id: string) {
		return this.contractsService.deleteOne(id);
	}
}
