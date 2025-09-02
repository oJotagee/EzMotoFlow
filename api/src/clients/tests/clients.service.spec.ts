import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateClientDto, TipoCliente } from '../dto/create-clients.dto';
import { UpdateClientsDto } from '../dto/update-clients.dto';
import { FilterDto } from '../dto/filter.dto';

const mockClient = {
	id: 'test-id',
	tipo: TipoCliente.PESSOA_FISICA,
	fullName: 'João Silva',
	documento: '12345678901',
	telefone: '11999999999',
	email: 'joao@example.com',
	dataNascimento: new Date('1990-01-01'),
	companyName: null,
	status: 'ativo' as any,
	cep: '12345-678',
	rua: 'Rua Teste',
	numero: '123',
	bairro: 'Bairro Teste',
	cidade: 'São Paulo',
	estado: 'SP',
	complementos: null,
	created_at: new Date(),
	updated_at: new Date(),
} as any;

const mockClientList = [mockClient];

const createClientDto: CreateClientDto = {
	tipo: TipoCliente.PESSOA_FISICA,
	fullName: 'João Silva',
	documento: '12345678901',
	telefone: '11999999999',
	email: 'joao@example.com',
	dataNascimento: '1990-01-01',
	companyName: undefined,
	cep: '12345-678',
	rua: 'Rua Teste',
	numero: '123',
	bairro: 'Bairro Teste',
	cidade: 'São Paulo',
	estado: 'SP',
	complementos: undefined,
};

const updateClientDto: UpdateClientsDto = {
	fullName: 'João Silva Updated',
	email: 'joao.updated@example.com',
};

describe('ClientsService', () => {
	let clientsService: ClientsService;
	let prismaService: PrismaService;

	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-05-08T03:54:13.000Z"));
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ClientsService,
				{
					provide: PrismaService,
					useValue: {
						tasks: {
							findMany: jest.fn(),
							findFirst: jest.fn(),
							create: jest.fn(),
							update: jest.fn(),
							delete: jest.fn(),
						},
					},
				},
			],
		}).compile();

		clientsService = module.get<ClientsService>(ClientsService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should be defined", () => {
		expect(clientsService).toBeDefined();
		expect(prismaService).toBeDefined();
	});

	// describe('getAll', () => {
	// 	it('should return an array of clients', async () => {
	// 		const filter: FilterDto = { limit: 6, offset: 0 };

	// 		jest.spyOn(prismaService.clients, 'findMany').mockResolvedValue(mockClientList);
	// 		const result = await clientsService.getAll(filter);

	// 		expect(prismaService.clients.findMany).toHaveBeenCalledWith({
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 			where: {},
	// 			take: 6,
	// 			skip: 0,
	// 			orderBy: {
	// 				created_at: 'asc',
	// 			},
	// 		});

	// 		expect(result).toEqual(mockClientList);
	// 	});

	// 	it('should return clients with custom filter', async () => {
	// 		const filter: FilterDto = {
	// 			limit: 10,
	// 			offset: 5,
	// 			status: 'ativo',
	// 			nome: 'João',
	// 		};

	// 		jest.spyOn(prismaService.clients, 'findMany').mockResolvedValue(mockClientList);
	// 		const result = await clientsService.getAll(filter);

	// 		expect(prismaService.clients.findMany).toHaveBeenCalledWith({
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 			where: {
	// 				status: 'ativo',
	// 				nome: {
	// 					contains: 'João',
	// 					mode: 'insensitive',
	// 				},
	// 			},
	// 			take: 10,
	// 			skip: 5,
	// 			orderBy: {
	// 				created_at: 'asc',
	// 			},
	// 		});

	// 		expect(result).toEqual(mockClientList);
	// 	});

	// 	it('should throw an error if findMany fails', async () => {
	// 		const filter: FilterDto = { limit: 6, offset: 0 };

	// 		jest.spyOn(prismaService.clients, 'findMany').mockRejectedValue(new Error('Database error'));

	// 		await expect(clientsService.getAll(filter)).rejects.toThrow(
	// 			new HttpException('Failed to get all clients', HttpStatus.INTERNAL_SERVER_ERROR),
	// 		);

	// 		expect(prismaService.clients.findMany).toHaveBeenCalledWith({
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 			where: {},
	// 			take: 6,
	// 			skip: 0,
	// 			orderBy: {
	// 				created_at: 'asc',
	// 			},
	// 		});
	// 	});
	// });

	// describe('getOne', () => {
	// 	it('should return a client', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(mockClient);

	// 		const result = await clientsService.getOne(mockClient.id);

	// 		expect(prismaService.clients.findFirst).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 				cep: true,
	// 				rua: true,
	// 				numero: true,
	// 				bairro: true,
	// 				cidade: true,
	// 				estado: true,
	// 				complementos: true,
	// 			},
	// 		});

	// 		expect(result).toEqual(mockClient);
	// 	});

	// 	it('should throw an error if findFirst fails', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockRejectedValue(new Error('Database error'));

	// 		await expect(clientsService.getOne(mockClient.id)).rejects.toThrow(
	// 			new HttpException('Failed to get clients', HttpStatus.INTERNAL_SERVER_ERROR),
	// 		);

	// 		expect(prismaService.clients.findFirst).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 				cep: true,
	// 				rua: true,
	// 				numero: true,
	// 				bairro: true,
	// 				cidade: true,
	// 				estado: true,
	// 				complementos: true,
	// 			},
	// 		});
	// 	});

	// 	it('should throw NOT_FOUND if client is not found', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(null);

	// 		await expect(clientsService.getOne('non-existent-id')).rejects.toThrow(
	// 			new HttpException('Clients not found', HttpStatus.NOT_FOUND),
	// 		);

	// 		expect(prismaService.clients.findFirst).toHaveBeenCalledWith({
	// 			where: { id: 'non-existent-id' },
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 				cep: true,
	// 				rua: true,
	// 				numero: true,
	// 				bairro: true,
	// 				cidade: true,
	// 				estado: true,
	// 				complementos: true,
	// 			},
	// 		});
	// 	});
	// });

	// describe('createOne', () => {
	// 	it('should create a client', async () => {
	// 		jest.spyOn(prismaService.clients, 'findUnique').mockResolvedValue(null);
	// 		jest.spyOn(prismaService.clients, 'create').mockResolvedValue(mockClient);

	// 		const result = await clientsService.createOne(createClientDto);

	// 		expect(prismaService.clients.findUnique).toHaveBeenCalledTimes(2);
	// 		expect(prismaService.clients.create).toHaveBeenCalledWith({
	// 			data: {
	// 				tipo: createClientDto.tipo,
	// 				fullName: createClientDto.fullName,
	// 				documento: createClientDto.documento,
	// 				telefone: createClientDto.telefone,
	// 				email: createClientDto.email,
	// 				dataNascimento: createClientDto.dataNascimento ? new Date(createClientDto.dataNascimento) : null,
	// 				companyName: createClientDto.companyName,
	// 				cep: createClientDto.cep,
	// 				rua: createClientDto.rua,
	// 				numero: createClientDto.numero,
	// 				bairro: createClientDto.bairro,
	// 				cidade: createClientDto.cidade,
	// 				estado: createClientDto.estado,
	// 				complementos: createClientDto.complementos,
	// 			},
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 		});

	// 		expect(result).toEqual(mockClient);
	// 	});

	// 	it('should throw CONFLICT if documento already exists', async () => {
	// 		jest.spyOn(prismaService.clients, 'findUnique').mockResolvedValue(mockClient);

	// 		await expect(clientsService.createOne(createClientDto)).rejects.toThrow(
	// 			new HttpException('Document is already registered.', HttpStatus.CONFLICT),
	// 		);
	// 	});

	// 	it('should throw CONFLICT if email already exists', async () => {
	// 		jest.spyOn(prismaService.clients, 'findUnique')
	// 			.mockResolvedValueOnce(null) // documento check
	// 			.mockResolvedValueOnce(mockClient); // email check

	// 		await expect(clientsService.createOne(createClientDto)).rejects.toThrow(
	// 			new HttpException('Email is already registered.', HttpStatus.CONFLICT),
	// 		);
	// 	});

	// 	it('should throw error if prisma create fails', async () => {
	// 		jest.spyOn(prismaService.clients, 'findUnique').mockResolvedValue(null);
	// 		jest.spyOn(prismaService.clients, 'create').mockRejectedValue(new Error('Error creating client'));

	// 		await expect(clientsService.createOne(createClientDto)).rejects.toThrow(
	// 			new HttpException('Error creating motorcycle', HttpStatus.INTERNAL_SERVER_ERROR),
	// 		);

	// 		expect(prismaService.clients.create).toHaveBeenCalledWith({
	// 			data: {
	// 				tipo: createClientDto.tipo,
	// 				fullName: createClientDto.fullName,
	// 				documento: createClientDto.documento,
	// 				telefone: createClientDto.telefone,
	// 				email: createClientDto.email,
	// 				dataNascimento: createClientDto.dataNascimento ? new Date(createClientDto.dataNascimento) : null,
	// 				companyName: createClientDto.companyName,
	// 				cep: createClientDto.cep,
	// 				rua: createClientDto.rua,
	// 				numero: createClientDto.numero,
	// 				bairro: createClientDto.bairro,
	// 				cidade: createClientDto.cidade,
	// 				estado: createClientDto.estado,
	// 				complementos: createClientDto.complementos,
	// 			},
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 		});
	// 	});
	// });

	// describe('updateOne', () => {
	// 	it('should update a client', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(mockClient);
	// 		jest.spyOn(prismaService.clients, 'update').mockResolvedValue(mockClient);

	// 		const result = await clientsService.updateOne(mockClient.id, updateClientDto);

	// 		expect(prismaService.clients.update).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 			data: {
	// 				...updateClientDto,
	// 				updated_at: expect.any(Date),
	// 			},
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 		});

	// 		expect(result).toEqual(mockClient);
	// 	});

	// 	it('should throw NOT_FOUND if client is not found', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(null);

	// 		await expect(clientsService.updateOne('non-existent-id', updateClientDto)).rejects.toThrow(
	// 			new HttpException('Clients not found', HttpStatus.NOT_FOUND),
	// 		);

	// 		expect(prismaService.clients.findFirst).toHaveBeenCalledWith({
	// 			where: { id: 'non-existent-id' },
	// 		});
	// 	});

	// 	it('should throw CONFLICT if documento already exists', async () => {
	// 		const updateWithDocument = { ...updateClientDto, documento: '98765432100' };

	// 		jest.spyOn(prismaService.clients, 'findUnique').mockResolvedValue(mockClient);

	// 		await expect(clientsService.updateOne(mockClient.id, updateWithDocument)).rejects.toThrow(
	// 			new HttpException('Document is already registered.', HttpStatus.CONFLICT),
	// 		);
	// 	});

	// 	it('should throw CONFLICT if email already exists', async () => {
	// 		const updateWithEmail = { ...updateClientDto, email: 'existing@example.com' };

	// 		jest.spyOn(prismaService.clients, 'findUnique').mockResolvedValue(mockClient);

	// 		await expect(clientsService.updateOne(mockClient.id, updateWithEmail)).rejects.toThrow(
	// 			new HttpException('Email is already registered.', HttpStatus.CONFLICT),
	// 		);
	// 	});

	// 	it('should throw error if prisma update fails', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(mockClient);
	// 		jest.spyOn(prismaService.clients, 'update').mockRejectedValue(new Error('Error updating client'));

	// 		await expect(clientsService.updateOne(mockClient.id, updateClientDto)).rejects.toThrow(
	// 			new HttpException('Error updating clients', HttpStatus.INTERNAL_SERVER_ERROR),
	// 		);

	// 		expect(prismaService.clients.update).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 			data: {
	// 				...updateClientDto,
	// 				updated_at: expect.any(Date),
	// 			},
	// 			select: {
	// 				id: true,
	// 				tipo: true,
	// 				fullName: true,
	// 				documento: true,
	// 				telefone: true,
	// 				email: true,
	// 				dataNascimento: true,
	// 				companyName: true,
	// 				status: true,
	// 			},
	// 		});
	// 	});
	// });

	// describe('deleteOne', () => {
	// 	it('should delete a client', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(mockClient);
	// 		jest.spyOn(prismaService.clients, 'delete').mockResolvedValue(mockClient);

	// 		const result = await clientsService.deleteOne(mockClient.id);

	// 		expect(prismaService.clients.delete).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 		});

	// 		expect(result).toEqual({
	// 			message: 'Client deleted successfully',
	// 		});
	// 	});

	// 	it('should throw NOT_FOUND if client is not found', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(null);

	// 		await expect(clientsService.deleteOne('non-existent-id')).rejects.toThrow(
	// 			new HttpException('Client not found', HttpStatus.NOT_FOUND),
	// 		);

	// 		expect(prismaService.clients.findFirst).toHaveBeenCalledWith({
	// 			where: { id: 'non-existent-id' },
	// 		});
	// 	});

	// 	it('should throw error if prisma delete fails', async () => {
	// 		jest.spyOn(prismaService.clients, 'findFirst').mockResolvedValue(mockClient);
	// 		jest.spyOn(prismaService.clients, 'delete').mockRejectedValue(new Error('Error deleting client'));

	// 		await expect(clientsService.deleteOne(mockClient.id)).rejects.toThrow(
	// 			new HttpException('Error deleting client', HttpStatus.INTERNAL_SERVER_ERROR),
	// 		);

	// 		expect(prismaService.clients.delete).toHaveBeenCalledWith({
	// 			where: { id: mockClient.id },
	// 		});
	// 	});
	// });
});
