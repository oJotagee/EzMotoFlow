import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/mail/mail.service';
import { FilterDto } from './dto/filter.dto';
import {
	ResponseAllContractsDto,
	ResponseContractsDto,
	PaginatedContractsResponseDto,
} from './dto/response.dto';

@Injectable()
export class ContractService {
	constructor(
		private prismaService: PrismaService,
		private emailService: EmailService,
	) {}

	async getAll(filter: FilterDto): Promise<PaginatedContractsResponseDto> {
		try {
			const {
				limit = 10,
				offset = 0,
				status,
				nomeCliente,
				documentoCliente,
				placa,
				renavam,
				dataInicio,
				dataFim,
			} = filter;

			const page = Math.floor(offset / limit) + 1;

			const whereConditions = {
				...(status && { status }),
				...(nomeCliente && {
					client: {
						fullName: {
							contains: nomeCliente,
							mode: 'insensitive' as const,
						},
					},
				}),
				...(documentoCliente && {
					client: {
						documento: {
							contains: documentoCliente,
							mode: 'insensitive' as const,
						},
					},
				}),
				...(placa && {
					motorcycle: {
						placa: {
							contains: placa,
							mode: 'insensitive' as const,
						},
					},
				}),
				...(renavam && {
					motorcycle: {
						renavam: {
							contains: renavam,
							mode: 'insensitive' as const,
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
			};

			const total = await this.prismaService.contracts.count({
				where: whereConditions,
			});

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
				data: contracts,
				total,
				page,
				limit,
				pages,
			};
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
					motorcycleId: true,
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
			const findMotorcycle = await this.prismaService.motorCycle.findFirst({
				where: { id: body.motorcycleId, status: 'ativo' },
			});

			if (!findMotorcycle) {
				throw new HttpException(
					`Motorcycle with ID ${body.motorcycleId} not found`,
					HttpStatus.NOT_FOUND,
				);
			}

			const findClient = await this.prismaService.clients.findFirst({
				where: { id: body.clientId },
			});

			if (!findClient) {
				throw new HttpException(
					`Client with ID ${body.clientId} not found`,
					HttpStatus.NOT_FOUND,
				);
			}

			const existingActiveContract =
				await this.prismaService.contracts.findFirst({
					where: {
						motorcycleId: body.motorcycleId,
						status: 'ativo',
					},
				});

			if (existingActiveContract) {
				throw new HttpException(
					'There is already an active contract for this motorcycle',
					HttpStatus.BAD_REQUEST,
				);
			}

			const signatureToken = crypto.randomUUID();
			const tokenExpiry = new Date();
			tokenExpiry.setHours(tokenExpiry.getHours() + 48);

			const newContract = await this.prismaService.contracts.create({
				data: {
					valor: findMotorcycle.valor_venda,
					observacao: body.observacao,
					pagamento: body.pagamento,
					contractoPdf: '',
					signatureToken,
					signatureTokenExpiry: tokenExpiry,
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
					signatureToken: true,
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

			await this.prismaService.motorCycle.update({
				where: { id: body.motorcycleId },
				data: { status: 'andamento' },
			});

			try {
				await this.emailService.sendSignatureLink(
					findClient.email,
					findClient.fullName,
					newContract.id,
					signatureToken,
				);
			} catch (emailError) {
				console.error('Erro ao enviar email de assinatura:', emailError);
			}

			return newContract;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}

			throw new HttpException(
				'Failed to create the contract',
				HttpStatus.INTERNAL_SERVER_ERROR,
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

			await this.prismaService.contracts.update({
				where: {
					id: findContract.id,
				},
				data: { status: 'cancelado' },
			});

			await this.prismaService.motorCycle.update({
				where: { id: findContract.motorcycleId },
				data: { status: 'ativo' },
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

	async resendSignatureEmail(contractId: string) {
		try {
			const contract = await this.prismaService.contracts.findFirst({
				where: { id: contractId },
				include: {
					client: true,
					motorcycle: true,
				},
			});

			if (!contract) {
				throw new HttpException('Contract not found', HttpStatus.NOT_FOUND);
			}

			if (!contract.signatureToken || !contract.signatureTokenExpiry) {
				throw new HttpException(
					'Token de assinatura não encontrado para este contrato',
					HttpStatus.BAD_REQUEST,
				);
			}

			if (contract.signatureTokenExpiry < new Date()) {
				const newToken = crypto.randomUUID();
				const tokenExpiry = new Date();
				tokenExpiry.setHours(tokenExpiry.getHours() + 48);

				await this.prismaService.contracts.update({
					where: { id: contractId },
					data: {
						signatureToken: newToken,
						signatureTokenExpiry: tokenExpiry,
					},
				});

				await this.emailService.sendSignatureLink(
					contract.client.email,
					contract.client.fullName,
					contractId,
					newToken,
				);
			} else {
				await this.emailService.sendSignatureLink(
					contract.client.email,
					contract.client.fullName,
					contractId,
					contract.signatureToken,
				);
			}

			return { message: 'Email de assinatura reenviado com sucesso!' };
		} catch (error) {
			throw new HttpException(
				'Erro ao reenviar email de assinatura',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getContractForSignature(contractId: string, token: string) {
		try {
			const contract = await this.prismaService.contracts.findFirst({
				where: {
					id: contractId,
					signatureToken: token,
					signatureTokenExpiry: {
						gt: new Date(),
					},
				},
				include: {
					client: true,
					motorcycle: true,
				},
			});

			if (!contract) {
				throw new HttpException(
					'Contrato não encontrado ou token inválido/expirado',
					HttpStatus.NOT_FOUND,
				);
			}

			return contract;
		} catch (error) {
			throw new HttpException(
				'Erro ao buscar contrato',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async signContract(contractId: string, token: string, signatureData: any) {
		try {
			const updatedContract = await this.prismaService.contracts.update({
				where: { id: contractId },
				data: {
					signatures: signatureData,
					signatureToken: null,
					signatureTokenExpiry: null,
					status: 'finalizado',
				},
				select: {
					id: true,
					motorcycleId: true,
					valor: true,
				},
			});

			await this.prismaService.motorCycle.update({
				where: { id: updatedContract.motorcycleId },
				data: { status: 'vendido' },
			});

			return {
				message: 'Contrato assinado com sucesso!',
				contract: updatedContract,
			};
		} catch (error) {
			throw new HttpException(
				'Erro ao assinar contrato',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
