import { HashingProtocol } from './hash/hashing.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptService } from './hash/bcrypt.service';
import { AuthController } from './auth.controller';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

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
