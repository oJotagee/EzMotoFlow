import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
  @ApiOperation({ summary: "Login user" })  
	login(@Body() loginDto: LoginDto) {
		return this.authService.autenticate(loginDto);
	}
}
