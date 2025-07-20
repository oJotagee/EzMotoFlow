import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashingProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';

@Global()
@Module({
	imports: [
		PrismaModule,
		ConfigModule.forFeature(jwtConfig),
		JwtModule.registerAsync(jwtConfig.asProvider()),
	],
	providers: [
		{
			provide: HashingProtocol,
			useClass: BcryptService,
		},
		AuthService,
	],
	exports: [HashingProtocol, JwtModule, ConfigModule],
	controllers: [AuthController],
})
export class AuthModule {}
