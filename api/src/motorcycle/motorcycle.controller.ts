import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MotorcycleService } from './motorcycle.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { PaginationDto } from 'src/commom/dto/pagination.dto';

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
}
