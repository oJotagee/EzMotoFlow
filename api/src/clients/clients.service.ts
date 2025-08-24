import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { CreateClientDto } from './dto/create-clients.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto } from './dto/filter.dto';
import {
	ResponseAllClientsDto,
	ResponseClientDto,
	ResponseClientsDto,
} from './dto/response.dto';

@Injectable()
export class ClientsService {
	constructor(private prismaService: PrismaService) {}

	async getAll(filter: FilterDto): Promise<ResponseAllClientsDto[]> {
		try {
			const { limit = 6, offset = 0, status = '', nome = '' } = filter;

			const clients = await this.prismaService.clients.findMany({
				select: {
					id: true,
					tipo: true,
					fullName: true,
					documento: true,
					telefone: true,
					email: true,
					dataNascimento: true,
					companyName: true,
					status: true,
				},
				where: {
					...(status && { status }),
					...(nome && {
						nome: {
							contains: nome,
							mode: 'insensitive',
						},
					}),
				},
				take: limit,
				skip: offset,
				orderBy: {
					created_at: 'asc',
				},
			});

			return clients;
		} catch (error) {
			throw new HttpException(
				'Failed to get all clients',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getOne(id: string): Promise<ResponseClientDto> {
		try {
			const clients = await this.prismaService.clients.findFirst({
				where: { id: id },
				select: {
					id: true,
					tipo: true,
					fullName: true,
					documento: true,
					telefone: true,
					email: true,
					dataNascimento: true,
					companyName: true,
					status: true,
					cep: true,
					rua: true,
					numero: true,
					bairro: true,
					cidade: true,
					estado: true,
					complementos: true,
				},
			});

			if (!clients)
				throw new HttpException('Clients not found', HttpStatus.NOT_FOUND);

			return clients;
		} catch (error) {
			throw new HttpException(
				'Failed to get clients',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createOne(body: CreateClientDto): Promise<ResponseAllClientsDto> {
		try {
			const existingByDocument = await this.prismaService.clients.findUnique({
				where: { documento: body.documento },
			});

			if (existingByDocument)
				throw new HttpException(
					'Document is already registered.',
					HttpStatus.CONFLICT,
				);

			const existingByemail = await this.prismaService.clients.findUnique({
				where: { email: body.email },
			});

			if (existingByemail)
				throw new HttpException(
					'Email is already registered.',
					HttpStatus.CONFLICT,
				);

			const newClients = await this.prismaService.clients.create({
				data: {
					tipo: body.tipo,
					fullName: body.fullName,
					documento: body.documento,
					telefone: body.telefone,
					email: body.email,
					dataNascimento: body.dataNascimento
						? new Date(body.dataNascimento)
						: null,
					companyName: body.companyName,
					cep: body.cep,
					rua: body.rua,
					numero: body.numero,
					bairro: body.bairro,
					cidade: body.cidade,
					estado: body.estado,
					complementos: body.complementos,
				},
				select: {
					id: true,
					tipo: true,
					fullName: true,
					documento: true,
					telefone: true,
					email: true,
					dataNascimento: true,
					companyName: true,
					status: true,
				},
			});

			return newClients;
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
		body: UpdateClientsDto,
	): Promise<ResponseAllClientsDto> {
		try {
			if (body.documento) {
				const existingByDocument = await this.prismaService.clients.findUnique({
					where: { documento: body.documento },
				});

				if (existingByDocument)
					throw new HttpException(
						'Document is already registered.',
						HttpStatus.CONFLICT,
					);
			}

			if (body.email) {
				const existingByemail = await this.prismaService.clients.findUnique({
					where: { email: body.email },
				});

				if (existingByemail)
					throw new HttpException(
						'Email is already registered.',
						HttpStatus.CONFLICT,
					);
			}

			const findClient = await this.prismaService.clients.findFirst({
				where: {
					id: id,
				},
			});

			if (!findClient)
				throw new HttpException('Clients not found', HttpStatus.NOT_FOUND);

			const clientUpdated = await this.prismaService.clients.update({
				where: {
					id: findClient.id,
				},
				data: {
					...body,
					dataNascimento: body.dataNascimento
						? new Date(body.dataNascimento)
						: undefined,
					updated_at: new Date(),
				},
				select: {
					id: true,
					tipo: true,
					fullName: true,
					documento: true,
					telefone: true,
					email: true,
					dataNascimento: true,
					companyName: true,
					status: true,
				},
			});

			return clientUpdated;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(
				'Error updating clients',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async deleteOne(id: string): Promise<ResponseClientsDto> {
		try {
			const findClient = await this.prismaService.clients.findFirst({
				where: {
					id: id,
				},
			});

			if (!findClient)
				throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

			await this.prismaService.clients.delete({
				where: {
					id: id,
				},
			});

			return { message: 'Client deleted successfully' };
		} catch (error) {
			throw new HttpException(
				'Error deleting client',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
