import { CreateClientDto, TipoCliente } from '../dto/create-clients.dto';
import { UpdateClientsDto } from '../dto/update-clients.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientsController } from '../clients.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients.service';
import { FilterDto } from '../dto/filter.dto';

describe('ClientsController', () => {
	let controller: ClientsController;
	let service: ClientsService;

	const mockClientsService = {
		getAll: jest.fn(),
		getOne: jest.fn(),
		createOne: jest.fn(),
		updateOne: jest.fn(),
		deleteOne: jest.fn(),
	};

	const mockClient = {
		id: 'test-id',
		tipo: TipoCliente.PESSOA_FISICA,
		fullName: 'João Silva',
		documento: '12345678901',
		telefone: '11999999999',
		email: 'joao@example.com',
		dataNascimento: new Date('1990-01-01'),
		companyName: null,
		status: 'ativo',
	};

	const mockCreateClientDto: CreateClientDto = {
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

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientsController],
			providers: [
				{
					provide: ClientsService,
					useValue: mockClientsService,
				},
			],
		}).compile();

		controller = module.get<ClientsController>(ClientsController);
		service = module.get<ClientsService>(ClientsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('GET /clients - fintAllMotorcycle', () => {
		it('should return all clients with default filter', async () => {
			const mockFilter: FilterDto = { limit: 6, offset: 0 };
			const mockClients = [mockClient];

			mockClientsService.getAll.mockResolvedValue(mockClients);

			const result = await controller.fintAllMotorcycle(mockFilter);

			expect(service.getAll).toHaveBeenCalledWith(mockFilter);
			expect(result).toEqual(mockClients);
		});

		it('should return clients with custom filter', async () => {
			const mockFilter: FilterDto = {
				limit: 10,
				offset: 5,
				status: 'ativo',
				nome: 'João',
			};
			const mockClients = [mockClient];

			mockClientsService.getAll.mockResolvedValue(mockClients);

			const result = await controller.fintAllMotorcycle(mockFilter);

			expect(service.getAll).toHaveBeenCalledWith(mockFilter);
			expect(result).toEqual(mockClients);
		});

		it('should handle service errors', async () => {
			const mockFilter: FilterDto = { limit: 6, offset: 0 };
			const error = new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR);

			mockClientsService.getAll.mockRejectedValue(error);

			await expect(controller.fintAllMotorcycle(mockFilter)).rejects.toThrow(error);
			expect(service.getAll).toHaveBeenCalledWith(mockFilter);
		});
	});

	describe('GET /clients/:id - findMotorcycleById', () => {
		it('should return a client by id', async () => {
			const clientId = 'test-id';

			mockClientsService.getOne.mockResolvedValue(mockClient);

			const result = await controller.findMotorcycleById(clientId);

			expect(service.getOne).toHaveBeenCalledWith(clientId);
			expect(result).toEqual(mockClient);
		});

		it('should handle client not found', async () => {
			const clientId = 'non-existent-id';
			const error = new HttpException('Clients not found', HttpStatus.NOT_FOUND);

			mockClientsService.getOne.mockRejectedValue(error);

			await expect(controller.findMotorcycleById(clientId)).rejects.toThrow(error);
			expect(service.getOne).toHaveBeenCalledWith(clientId);
		});

		it('should handle service errors', async () => {
			const clientId = 'test-id';
			const error = new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR);

			mockClientsService.getOne.mockRejectedValue(error);

			await expect(controller.findMotorcycleById(clientId)).rejects.toThrow(error);
			expect(service.getOne).toHaveBeenCalledWith(clientId);
		});
	});

	describe('POST /clients - CreateMotorcycle', () => {
		it('should create a new client successfully', async () => {
			mockClientsService.createOne.mockResolvedValue(mockClient);

			const result = await controller.CreateMotorcycle(mockCreateClientDto);

			expect(service.createOne).toHaveBeenCalledWith(mockCreateClientDto);
			expect(result).toEqual(mockClient);
		});

		it('should handle documento already exists error', async () => {
			const error = new HttpException('Document is already registered.', HttpStatus.CONFLICT);

			mockClientsService.createOne.mockRejectedValue(error);

			await expect(controller.CreateMotorcycle(mockCreateClientDto)).rejects.toThrow(error);
			expect(service.createOne).toHaveBeenCalledWith(mockCreateClientDto);
		});

		it('should handle email already exists error', async () => {
			const error = new HttpException('Email is already registered.', HttpStatus.CONFLICT);

			mockClientsService.createOne.mockRejectedValue(error);

			await expect(controller.CreateMotorcycle(mockCreateClientDto)).rejects.toThrow(error);
			expect(service.createOne).toHaveBeenCalledWith(mockCreateClientDto);
		});

		it('should handle service errors', async () => {
			const error = new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR);

			mockClientsService.createOne.mockRejectedValue(error);

			await expect(controller.CreateMotorcycle(mockCreateClientDto)).rejects.toThrow(error);
			expect(service.createOne).toHaveBeenCalledWith(mockCreateClientDto);
		});
	});

	describe('PATCH /clients/:id - UpdatePost', () => {
		const mockUpdateDto: UpdateClientsDto = {
			fullName: 'João Silva Updated',
			email: 'joao.updated@example.com',
		};

		it('should update a client successfully', async () => {
			const clientId = 'test-id';
			const updatedClient = { ...mockClient, ...mockUpdateDto };

			mockClientsService.updateOne.mockResolvedValue(updatedClient);

			const result = await controller.UpdatePost(clientId, mockUpdateDto);

			expect(service.updateOne).toHaveBeenCalledWith(clientId, mockUpdateDto);
			expect(result).toEqual(updatedClient);
		});

		it('should handle client not found error', async () => {
			const clientId = 'non-existent-id';
			const error = new HttpException('Clients not found', HttpStatus.NOT_FOUND);

			mockClientsService.updateOne.mockRejectedValue(error);

			await expect(controller.UpdatePost(clientId, mockUpdateDto)).rejects.toThrow(error);
			expect(service.updateOne).toHaveBeenCalledWith(clientId, mockUpdateDto);
		});

		it('should handle service errors', async () => {
			const clientId = 'test-id';
			const error = new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR);

			mockClientsService.updateOne.mockRejectedValue(error);

			await expect(controller.UpdatePost(clientId, mockUpdateDto)).rejects.toThrow(error);
			expect(service.updateOne).toHaveBeenCalledWith(clientId, mockUpdateDto);
		});
	});

	describe('DELETE /clients/:id - DeletePost', () => {
		it('should delete a client successfully', async () => {
			const clientId = 'test-id';
			const deleteResponse = { message: 'Client deleted successfully' };

			mockClientsService.deleteOne.mockResolvedValue(deleteResponse);

			const result = await controller.DeletePost(clientId);

			expect(service.deleteOne).toHaveBeenCalledWith(clientId);
			expect(result).toEqual(deleteResponse);
		});

		it('should handle client not found error', async () => {
			const clientId = 'non-existent-id';
			const error = new HttpException('Client not found', HttpStatus.NOT_FOUND);

			mockClientsService.deleteOne.mockRejectedValue(error);

			await expect(controller.DeletePost(clientId)).rejects.toThrow(error);
			expect(service.deleteOne).toHaveBeenCalledWith(clientId);
		});

		it('should handle service errors', async () => {
			const clientId = 'test-id';
			const error = new HttpException('Service error', HttpStatus.INTERNAL_SERVER_ERROR);

			mockClientsService.deleteOne.mockRejectedValue(error);

			await expect(controller.DeletePost(clientId)).rejects.toThrow(error);
			expect(service.deleteOne).toHaveBeenCalledWith(clientId);
		});
	});

	describe('Controller Dependencies', () => {
		it('should have ClientsService injected', () => {
			expect(service).toBeDefined();
			expect(service).toBe(mockClientsService);
		});
	});
});
