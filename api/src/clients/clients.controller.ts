import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { ClientsService } from './clients.service';
import { FilterDto } from './dto/filter.dto';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Get all clients' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of clients to fetch',
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		example: 0,
		description: 'Number of clients to skip',
	})
	@ApiQuery({
		name: 'status',
		required: false,
		example: '',
		description: 'Filter by clients status: "active" or "inactive"',
	})
	@ApiQuery({
		name: 'tipo',
		required: false,
		example: '',
		description: 'Filter by type: "PESSOA_FISICA" or "PESSOA_JURIDICA"',
	})
	@ApiQuery({
		name: 'nome',
		required: false,
		example: '',
		description: 'Filter by clients name',
	})
	fintAllMotorcycle(@Query() Filter: FilterDto) {
		return this.clientsService.getAll(Filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a clients' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Clients identifier',
	})
	findMotorcycleById(@Param('id') id: string) {
		return this.clientsService.getOne(id);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	CreateMotorcycle(@Body() body: CreateClientDto) {
		return this.clientsService.createOne(body);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Update a client' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Client identifier',
	})
	UpdatePost(@Param('id') id: string, @Body() body: UpdateClientsDto) {
		return this.clientsService.updateOne(id, body);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Client identifier',
	})
	@ApiOperation({ summary: 'Delete a client' })
	DeletePost(@Param('id') id: string) {
		return this.clientsService.deleteOne(id);
	}
}
