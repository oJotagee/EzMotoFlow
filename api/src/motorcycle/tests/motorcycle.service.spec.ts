import { MotorcycleService } from '../motorcycle.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('MotorcycleService', () => {
	let service: MotorcycleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MotorcycleService],
		}).compile();

		service = module.get<MotorcycleService>(MotorcycleService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
