import { Module } from '@nestjs/common';
import { MotorcycleController } from './motorcycle.controller';
import { MotorcycleService } from './motorcycle.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [MotorcycleController],
	providers: [MotorcycleService],
})
export class MotorcycleModule {}
