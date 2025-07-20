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
import { MotorcycleService } from './motorcycle.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { FilterDto } from './dto/filter.dto';

@Controller('motorcycle')
export class MotorcycleController {
	constructor(private readonly motorcycleService: MotorcycleService) {}

	@Get()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Get all motorcycles' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of motorcycle to fetch',
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		example: 0,
		description: 'Number of motorcycle to skip',
	})
	@ApiQuery({
		name: 'status',
		required: false,
		example: '',
		description: 'Filter by motorcycle status: "active" or "inactive"',
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
		description: 'Filtrar por ano da motocicleta (exato)',
	})
	@ApiQuery({
		name: 'anoMax',
		required: false,
		example: 2025,
		description: 'Filtrar por ano da motocicleta (exato)',
	})
	fintAllMotorcycle(@Query() Filter: FilterDto) {
		return this.motorcycleService.getAll(Filter);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a motorcycle' })
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
	CreateMotorcycle(@Body() body: CreateMotorCycleDto) {
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
	UpdatePost(@Param('id') id: string, @Body() body: UpdateMotorcycleDto) {
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
	DeletePost(@Param('id') id: string) {
		return this.motorcycleService.deleteOne(id);
	}
}
