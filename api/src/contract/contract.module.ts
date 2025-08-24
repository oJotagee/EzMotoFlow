import { ContractController } from './contract.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContractService } from './contract.service';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContractController],
  providers: [ContractService]
})
export class ContractModule {}
