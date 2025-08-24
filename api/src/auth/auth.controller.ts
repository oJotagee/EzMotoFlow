import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@ApiOperation({ summary: 'Login user' })
	login(@Body() loginDto: LoginDto) {
		return this.authService.autenticate(loginDto);
	}
}
