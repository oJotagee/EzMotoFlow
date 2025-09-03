import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMotorCycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { FilterDto } from './dto/filter.dto';
import {
	ResponseAllMotorcycleDto,
	ResponseMotorcycleDto,
	PaginatedMotorcyclesResponseDto,
} from './dto/response.dto';

@Injectable()
export class MotorcycleService {
	constructor(
		private prismaService: PrismaService,
		private s3Service: AwsS3Service,
	) {}

	async getAll(filter: FilterDto): Promise<PaginatedMotorcyclesResponseDto> {
		try {
			const {
				limit = 10,
				offset = 0,
				status = '',
				placa = '',
				nome = '',
				anoMin,
				anoMax,
			} = filter;

			const page = Math.floor(offset / limit) + 1;

			const whereConditions = {
				...(status && { status }),
				...(placa && {
					placa: {
						contains: placa,
						mode: 'insensitive' as const,
					},
				}),
				...(nome && {
					nome: {
						contains: nome,
						mode: 'insensitive' as const,
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
			};

			const total = await this.prismaService.motorCycle.count({
				where: whereConditions,
			});

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
				where: whereConditions,
				take: limit,
				skip: offset,
				orderBy: {
					created_at: 'asc',
				},
			});

			const pages = Math.ceil(total / limit);

			return {
				data: motorcycles,
				total,
				page,
				limit,
				pages,
			};
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
					foto1: true,
					foto2: true,
					foto3: true,
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
			const fotos = [body.foto1, body.foto2, body.foto3];

			const existingByPlate = await this.prismaService.motorCycle.findUnique({
				where: { placa: body.placa },
			});

			if (existingByPlate)
				throw new HttpException(
					'Plate is already registered.',
					HttpStatus.CONFLICT,
				);

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

			const fotoUrls = await Promise.all(
				fotos.map((foto) =>
					foto && foto !== ''
						? this.s3Service.uploadBase64Image(foto)
						: Promise.resolve(null),
				),
			);

			const [fotoUrl1, fotoUrl2, fotoUrl3] = fotoUrls;

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
					foto1: fotoUrl1,
					foto2: fotoUrl2,
					foto3: fotoUrl3,
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
					foto1: true,
					foto2: true,
					foto3: true,
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
			if (body.placa) {
				const existingByPlate = await this.prismaService.motorCycle.findFirst({
					where: {
						placa: body.placa,
						id: { not: id },
					},
				});

				if (existingByPlate) {
					throw new HttpException(
						'Plate is already registered.',
						HttpStatus.CONFLICT,
					);
				}
			}

			if (body.chassi) {
				const existingByChassi = await this.prismaService.motorCycle.findFirst({
					where: {
						chassi: body.chassi,
						id: { not: id },
					},
				});

				if (existingByChassi) {
					throw new HttpException(
						'Chassi is already registered.',
						HttpStatus.CONFLICT,
					);
				}
			}

			if (body.renavam) {
				const existingByRenavam = await this.prismaService.motorCycle.findFirst(
					{
						where: {
							renavam: body.renavam,
							id: { not: id },
						},
					},
				);

				if (existingByRenavam) {
					throw new HttpException(
						'Renavam is already registered.',
						HttpStatus.CONFLICT,
					);
				}
			}

			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: {
					id: id,
				},
			});

			if (!findMotorcycle)
				throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			let foto1 = findMotorcycle.foto1;
			if (body.foto1 !== undefined) {
				if (
					body.foto1 &&
					body.foto1 !== '' &&
					!body.foto1.startsWith('https://')
				) {
					if (foto1) {
						await this.s3Service.deleteImage(foto1);
					}
					foto1 = await this.s3Service.uploadBase64Image(body.foto1);
				} else if (body.foto1 === null || body.foto1 === '') {
					// foto1 = null;
				} else {
					// Se for URL (começa com https), mantém como está
					foto1 = body.foto1;
				}
			}

			// Atualiza foto2
			let foto2 = findMotorcycle.foto2;
			if (body.foto2 !== undefined) {
				if (
					body.foto2 &&
					body.foto2 !== '' &&
					!body.foto2.startsWith('https://')
				) {
					if (foto2) {
						await this.s3Service.deleteImage(foto2);
					}
					foto2 = await this.s3Service.uploadBase64Image(body.foto2);
				} else if (body.foto2 === null || body.foto2 === '') {
					// foto2 = null;
				} else {
					foto2 = body.foto2;
				}
			}

			// Atualiza foto3
			let foto3 = findMotorcycle.foto3;
			if (body.foto3 !== undefined) {
				if (
					body.foto3 &&
					body.foto3 !== '' &&
					!body.foto3.startsWith('https://')
				) {
					if (foto3) {
						await this.s3Service.deleteImage(foto3);
					}
					foto3 = await this.s3Service.uploadBase64Image(body.foto3);
				} else if (body.foto3 === null || body.foto3 === '') {
					// foto3 = null;
				} else {
					foto3 = body.foto3;
				}
			}

			const motorcycle = await this.prismaService.motorCycle.update({
				where: {
					id: findMotorcycle.id,
				},
				data: {
					...body,
					ano: body.ano ? new Date(body.ano) : undefined,
					foto1: foto1,
					foto2: foto2,
					foto3: foto3,
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
					foto1: true,
					foto2: true,
					foto3: true,
					created_at: true,
					updated_at: true,
				},
			});

			return motorcycle;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
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

			const fotos = [
				findMotorcycle.foto1,
				findMotorcycle.foto2,
				findMotorcycle.foto3,
			];

			await Promise.all(
				fotos.map((foto) =>
					foto && foto !== ''
						? this.s3Service.deleteImage(foto)
						: Promise.resolve(),
				),
			);

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
