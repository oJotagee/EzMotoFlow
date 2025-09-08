import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { MotorcycleService } from './motorcycle.service';
import { FilterDto } from './dto/filter.dto';
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
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';

@Controller('motorcycle')
export class MotorcycleController {
	constructor(private readonly motorcycleService: MotorcycleService) {}

	@Get()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Get all motorcycles with pagination' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of motorcycles to fetch (max 10)',
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		example: 0,
		description: 'Number of motorcycles to skip',
	})
	@ApiQuery({
		name: 'status',
		required: false,
		example: '',
		description:
			'Filter by motorcycle status: "ativo", "inativo", "vendido" or "andamento"',
	})
	@ApiQuery({
		name: 'placa',
		required: false,
		example: '',
		description: 'Filter motorcycle by license plate (exact or partial search)',
	})
	@ApiQuery({
		name: 'nome',
		required: false,
		example: '',
		description: 'Filter by motorcycle name',
	})
	@ApiQuery({
		name: 'anoMin',
		required: false,
		example: 2017,
		description: 'Filter by minimum year (inclusive)',
	})
	@ApiQuery({
		name: 'anoMax',
		required: false,
		example: 2025,
		description: 'Filter by maximum year (inclusive)',
	})
	findAllMotorcycles(@Query() filter: FilterDto) {
		return this.motorcycleService.getAll(filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a motorcycle by ID' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Motorcycle identifier',
	})
	findMotorcycleById(@Param('id') id: string) {
		return this.motorcycleService.getOne(id);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Create a new motorcycle' })
	createMotorcycle(@Body() body: CreateMotorCycleDto) {
		return this.motorcycleService.createOne(body);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Update a motorcycle' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Motorcycle identifier',
	})
	updateMotorcycle(@Param('id') id: string, @Body() body: UpdateMotorcycleDto) {
		return this.motorcycleService.updateOne(id, body);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Motorcycle identifier',
	})
	@ApiOperation({ summary: 'Delete a motorcycle' })
	deleteMotorcycle(@Param('id') id: string) {
		return this.motorcycleService.deleteOne(id);
	}
}
