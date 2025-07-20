import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAllMotorcycleDto, ResponseMotorcycleDto } from './dto/response.dto';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';

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
        "Failed to get all motorcycles",
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOne(id: string): Promise<ResponseAllMotorcycleDto> {
    try {
      const motorcycle = await this.prismaService.motorCycle.findFirst({
        where: { id: id },
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
        }
      })

      if (!motorcycle) throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

      return motorcycle
    } catch (error) {
      throw new HttpException(
        "Failed to get motorcycle",
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOne(body: CreateMotorCycleDto): Promise<ResponseAllMotorcycleDto> {
		try {
			const newMotorcycle = await this.prismaService.motorCycle.create({
				data: {
					cor: body.cor,
					placa: body.placa,
					ano: new Date(body.ano),
					chassi: body.chassi,
					renavam: body.renavam,
					km: body.km,
					valor_compra: body.valor_compra,
					valor_venda: body.valor_venda,
					valor_fipe: body.valor_fipe,
					observacao: body.observacao,
				},
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
				}
			});
	
			return newMotorcycle;
		} catch (error) {
			throw new HttpException(
        'Error creating motorcycle',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
		}
	}

  async updateOne(id: string, body: UpdateMotorcycleDto): Promise<ResponseAllMotorcycleDto> {
		try {
			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: {
					id: id,
				},
			});

			if (!findMotorcycle) throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			const motorcycle = await this.prismaService.motorCycle.update({
				where: {
					id: findMotorcycle.id,
				},
				data: {
					...body,
					updated_at: new Date()
				},
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
			});

			return motorcycle;
		} catch (error) {
			throw new HttpException(
        'Error updating motorcycle', 
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
		}
	}

	async deleteOne(id: string): Promise<ResponseMotorcycleDto> {
		try {
			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: {
					id: id,
				},
			});

			if (!findMotorcycle) throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			await this.prismaService.motorCycle.delete({
				where: {
					id: id,
				},
			});

			return { message: 'Motorcycle deleted successfully' };
		} catch (error) {
			throw new HttpException(
        'Error deleting post',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      );
		}
	}

}
