import { PrismaModule } from '@api/prisma/prisma.module';
import { UsersController } from './users.controller';
import { AuthModule } from '@api/auth/auth.module';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
