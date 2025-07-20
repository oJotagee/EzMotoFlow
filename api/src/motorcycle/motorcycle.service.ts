import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
	ResponseAllMotorcycleDto,
	ResponseMotorcycleDto,
} from './dto/response.dto';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class MotorcycleService {
	constructor(private prismaService: PrismaService) {}

	async getAll(filter: FilterDto): Promise<ResponseAllMotorcycleDto[]> {
		try {
			const {
				limit = 6,
				offset = 0,
				status = '',
				placa = '',
				nome = '',
				anoMin,
				anoMax,
			} = filter;

			const motorcycles = await this.prismaService.motorCycle.findMany({
				select: {
					id: true,
					nome: true,
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
					status: true,
					created_at: true,
					updated_at: true,
				},
				where: {
					...(status && { status }),
					...(placa && {
						placa: {
							contains: placa,
							mode: 'insensitive',
						},
					}),
					...(nome && {
						nome: {
							contains: nome,
							mode: 'insensitive',
						},
					}),
					...(anoMin !== undefined && anoMax !== undefined
						? {
								ano: {
									gte: new Date(`${anoMin}-01-01T00:00:00.000Z`),
									lte: new Date(`${anoMax}-12-31T23:59:59.999Z`),
								},
							}
						: anoMin !== undefined
							? {
									ano: {
										gte: new Date(`${anoMin}-01-01T00:00:00.000Z`),
									},
								}
							: anoMax !== undefined
								? {
										ano: {
											lte: new Date(`${anoMax}-12-31T23:59:59.999Z`),
										},
									}
								: {}),
				},
				take: limit,
				skip: offset,
				orderBy: {
					created_at: 'asc',
				},
			});

			return motorcycles;
		} catch (error) {
			throw new HttpException(
				'Failed to get all motorcycles',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getOne(id: string): Promise<ResponseAllMotorcycleDto> {
		try {
			const motorcycle = await this.prismaService.motorCycle.findFirst({
				where: { id: id },
				select: {
					id: true,
					nome: true,
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
					status: true,
					created_at: true,
					updated_at: true,
				},
			});

			if (!motorcycle)
				throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			return motorcycle;
		} catch (error) {
			throw new HttpException(
				'Failed to get motorcycle',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createOne(
		body: CreateMotorCycleDto,
	): Promise<ResponseAllMotorcycleDto> {
		try {
			const existingByChassi = await this.prismaService.motorCycle.findUnique({
				where: { chassi: body.chassi },
			});

			if (existingByChassi)
				throw new HttpException(
					'Chassi is already registered.',
					HttpStatus.CONFLICT,
				);

			const existingByRenavam = await this.prismaService.motorCycle.findUnique({
				where: { renavam: body.renavam },
			});

			if (existingByRenavam)
				throw new HttpException(
					'Renavam is already registered.',
					HttpStatus.CONFLICT,
				);

			const newMotorcycle = await this.prismaService.motorCycle.create({
				data: {
					nome: body.nome,
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
					nome: true,
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
					status: true,
					created_at: true,
					updated_at: true,
				},
			});

			return newMotorcycle;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				'Error creating motorcycle',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateOne(
		id: string,
		body: UpdateMotorcycleDto,
	): Promise<ResponseAllMotorcycleDto> {
		try {
			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: {
					id: id,
				},
			});

			if (!findMotorcycle)
				throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			const motorcycle = await this.prismaService.motorCycle.update({
				where: {
					id: findMotorcycle.id,
				},
				data: {
					...body,
					ano: body.ano ? new Date(body.ano) : undefined,
					updated_at: new Date(),
				},
				select: {
					id: true,
					nome: true,
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
					status: true,
					created_at: true,
					updated_at: true,
				},
			});

			return motorcycle;
		} catch (error) {
			throw new HttpException(
				'Error updating motorcycle',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
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

			if (!findMotorcycle)
				throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			await this.prismaService.motorCycle.delete({
				where: {
					id: id,
				},
			});

			return { message: 'Motorcycle deleted successfully' };
		} catch (error) {
			throw new HttpException(
				'Error deleting post',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
