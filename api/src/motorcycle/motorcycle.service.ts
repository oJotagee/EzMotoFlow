import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAllMotorcycleDto } from './dto/response.dto';

@Injectable()
export class MotorcycleService {
  constructor(
    private prismaService: PrismaService,
  ){}
  
  async getAll(pagination: PaginationDto): Promise<ResponseAllMotorcycleDto[]> {
    try {
      const { limit = 6, offset = 0 } = pagination;

      const motorcycles = await this.prismaService.motorCycle.findMany({
        select: {
          id: true,
          cor: true,
          placa: true,
          ano: true,
          chassi: true,
          renavam: true,
          km: true,
          valor_compra: true,
          valor_venda: true,
          valor_fipe: true,
          observacao: true,
          created_at: true,
          updated_at: true,
        },
        take: limit,
				skip: offset,
				orderBy: {
					created_at: 'asc',
				},
      })

      return motorcycles
    } catch (error) {
      throw new HttpException(
        "Failed to update user",
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
