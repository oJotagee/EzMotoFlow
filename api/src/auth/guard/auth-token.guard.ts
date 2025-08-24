import { TOKEN_PAYLOAD } from '../commom/auth.constant';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,

		@Inject(jwtConfig.KEY)
		private jwtConfiguraton: ConfigType<typeof jwtConfig>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractToken(request);

		if (!token)
			throw new HttpException('Token not found.', HttpStatus.UNAUTHORIZED);

		try {
			const payload = await this.jwtService.verify(token, this.jwtConfiguraton);
			request[TOKEN_PAYLOAD] = payload;
		} catch (error) {
			throw new HttpException(
				'Invalid or expired token.',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		return true;
	}

	extractToken(request: Request) {
		const authorization = request.headers?.authorization;

		if (!authorization) return;

		return authorization.split(' ')[1];
	}
}
