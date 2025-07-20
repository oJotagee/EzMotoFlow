import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MotorcycleService } from './motorcycle.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { TokenPayload } from 'src/auth/params/token-payload.param';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';

@Controller('motorcycle')
export class MotorcycleController {
  constructor(private readonly motorcycleService: MotorcycleService){}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: "Get all motorcycles" })
  @ApiQuery({ 
    name: "limit",
    required: false,
    example: 10,
    description: "Limit of motorcycle to fetch"
  })
  @ApiQuery({ 
    name: "offset",
    required: false,
    example: 0,
    description: "Number of motorcycle to skip"
  })
  fintAllMotorcycle(@Query() Pagination: PaginationDto) {
    return this.motorcycleService.getAll(Pagination)
  }

  @Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: "Find a motorcycle" })
  @ApiParam({
		name: "id",
    example: "dtpysooc8k9p2mk6f09rv5ro",
    description: "Motorcycle identifier"
  })
	findMotorcycleById(@Param('id') id: string) {
		return this.motorcycleService.getOne(id);
	}

  @Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: "Create a motorcycle" })
	CreateMotorcycle(@Body() body: CreateMotorCycleDto) {
		return this.motorcycleService.createOne(body)
	}

  @Patch(":id")
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: "Update a motorcycle" })
  @ApiParam({
		name: "id",
    example: "dtpysooc8k9p2mk6f09rv5ro",
    description: "Motorcycle identifier"
  })
	UpdatePost(@Param("id") id: string, @Body() body: UpdateMotorcycleDto) {
		return this.motorcycleService.updateOne(id, body)
	}

	@Delete(":id")
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
  @ApiParam({
		name: "id",
    example: "dtpysooc8k9p2mk6f09rv5ro",
    description: "Motorcycle identifier"
  })
	@ApiOperation({ summary: "Delete a motorcycle" })
	DeletePost(@Param('id') id: string) {
		return this.motorcycleService.deleteOne(id)
	}
}
