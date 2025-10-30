import { ContractController } from './contract.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContractService } from './contract.service';
import { EmailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
	imports: [PrismaModule, AuthModule, HttpModule, EmailModule],
	controllers: [ContractController],
	providers: [ContractService],
})
export class ContractModule {}
