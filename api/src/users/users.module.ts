import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
