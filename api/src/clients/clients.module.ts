import { ClientsController } from './clients.controller';
import { PrismaModule } from '@api/prisma/prisma.module';
import { ClientsService } from './clients.service';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
