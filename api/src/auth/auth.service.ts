import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingProtocol } from './hash/hashing.service';
import { ResponseAuthDto } from './dto/response.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly hashingService: HashingProtocol,

		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {}

	async autenticate(LoginDto: LoginDto): Promise<ResponseAuthDto> {
		try {
			const findUser = await this.prisma.users.findFirst({
				where: {
					email: LoginDto.email,
				},
			});

			if (!findUser)
				throw new HttpException('User login error', HttpStatus.UNAUTHORIZED);

			const passwordValidated = await this.hashingService.compare(
				LoginDto.password,
				findUser.password,
			);

			if (!passwordValidated)
				throw new HttpException(
					'Incorrect username/password',
					HttpStatus.UNAUTHORIZED,
				);

			const token = await this.jwtService.signAsync(
				{
					sub: findUser.id,
					email: findUser.email,
				},
				{
					secret: this.jwtConfiguration.secret,
					audience: this.jwtConfiguration.audience,
					issuer: this.jwtConfiguration.issuer,
					expiresIn: this.jwtConfiguration.jwtTtl,
				},
			);

			return {
				id: findUser.id,
				name: findUser.name,
				email: findUser.email,
				token: token,
			};
		} catch (error) {
			throw new HttpException(
				error.message ? error.message : 'Error login',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
