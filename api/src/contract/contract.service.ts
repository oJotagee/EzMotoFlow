import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
import {
	ResponseAllContractsDto,
	ResponseContractsDto,
} from './dto/response.dto';

@Injectable()
export class ContractService {
	constructor(private prismaService: PrismaService) {}

	async getAll(filter: FilterDto): Promise<ResponseAllContractsDto[]> {
		try {
			const {
				limit = 6,
				offset = 0,
				status,
				nomeCliente,
				documentoCliente,
				placa,
				renavam,
				dataInicio,
				dataFim,
			} = filter;

			const contracts = await this.prismaService.contracts.findMany({
				select: {
					id: true,
					valor: true,
					data: true,
					status: true,
					observacao: true,
					pagamento: true,
					contractoPdf: true,
					motorcycle: {
						select: {
							id: true,
							nome: true,
							placa: true,
							renavam: true,
							chassi: true,
							ano: true,
						},
					},
					client: {
						select: {
							id: true,
							fullName: true,
							documento: true,
							telefone: true,
							email: true,
							dataNascimento: true,
							companyName: true,
						},
					},
				},
				where: {
					...(status && { status }),
					...(nomeCliente && {
						client: {
							fullName: {
								contains: nomeCliente,
								mode: 'insensitive',
							},
						},
					}),
					...(documentoCliente && {
						client: {
							documento: {
								contains: documentoCliente,
								mode: 'insensitive',
							},
						},
					}),
					...(placa && {
						motorcycle: {
							placa: {
								contains: placa,
								mode: 'insensitive',
							},
						},
					}),
					...(renavam && {
						motorcycle: {
							renavam: {
								contains: renavam,
								mode: 'insensitive',
							},
						},
					}),
					...(dataInicio !== undefined && dataFim !== undefined
						? {
								data: {
									gte: new Date(`${dataInicio}-01-01T00:00:00.000Z`),
									lte: new Date(`${dataFim}-12-31T23:59:59.999Z`),
								},
							}
						: dataInicio !== undefined
							? {
									data: {
										gte: new Date(`${dataInicio}-01-01T00:00:00.000Z`),
									},
								}
							: dataFim !== undefined
								? {
										data: {
											lte: new Date(`${dataFim}-12-31T23:59:59.999Z`),
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

			return contracts;
		} catch (error) {
			throw new HttpException(
				'Failed to get all contracts',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getOne(id: string): Promise<ResponseAllContractsDto> {
		try {
			const contract = await this.prismaService.contracts.findFirst({
				where: { id: id },
				select: {
					id: true,
					valor: true,
					data: true,
					status: true,
					observacao: true,
					pagamento: true,
					contractoPdf: true,
					motorcycle: {
						select: {
							id: true,
							nome: true,
							placa: true,
							renavam: true,
							chassi: true,
							ano: true,
						},
					},
					client: {
						select: {
							id: true,
							fullName: true,
							documento: true,
							telefone: true,
							email: true,
							dataNascimento: true,
							companyName: true,
						},
					},
				},
			});

			if (!contract) {
				throw new HttpException('Contract not found', HttpStatus.NOT_FOUND);
			}

			return contract;
		} catch (error) {
			throw new HttpException(
				'Failed to get the contract',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createOne(body: CreateContractDto): Promise<ResponseAllContractsDto> {
		try {
			const existingByContract = await this.prismaService.contracts.findFirst({
				where: {
					motorcycleId: body.motorcycleId,
					clientId: body.clientId,
				},
			});

			if (existingByContract)
				throw new HttpException(
					'Contract already exists for this client and motorcycle',
					HttpStatus.BAD_REQUEST,
				);

			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: { id: body.motorcycleId },
			});

			if (!findMotorcycle)
				throw new HttpException('Motorcycle not found', HttpStatus.NOT_FOUND);

			const findClient = await this.prismaService.clients.findFirst({
				where: { id: body.clientId },
			});

			if (!findClient)
				throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

			const newContract = await this.prismaService.contracts.create({
				data: {
					valor: findMotorcycle.valor_venda,
					observacao: body.observacao,
					pagamento: body.pagamento,
					contractoPdf: body.contractoPdf,
					motorcycleId: body.motorcycleId,
					clientId: body.clientId,
				},
				select: {
					id: true,
					valor: true,
					data: true,
					status: true,
					observacao: true,
					pagamento: true,
					contractoPdf: true,
					motorcycle: {
						select: {
							id: true,
							nome: true,
							placa: true,
							renavam: true,
							chassi: true,
							ano: true,
						},
					},
					client: {
						select: {
							id: true,
							fullName: true,
							documento: true,
							telefone: true,
							email: true,
							dataNascimento: true,
							companyName: true,
						},
					},
				},
			});

			return newContract;
		} catch (error) {
			throw new HttpException(
				'Failed to create the contract',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(id: string): Promise<ResponseContractsDto> {
		try {
			const findContract = await this.prismaService.contracts.findFirst({
				where: {
					id: id,
				},
			});

			if (!findContract) {
				throw new HttpException('Contract not found', HttpStatus.NOT_FOUND);
			}

			await this.prismaService.contracts.delete({
				where: {
					id: findContract.id,
				},
			});

			return { message: 'Contract deleted successfully' };
		} catch (error) {
			throw new HttpException(
				'Failed to delete the contract',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
