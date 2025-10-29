import { TokenPayload } from 'src/auth/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UsersService } from './users.service';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Get all users with pagination' })
	@ApiQuery({
		name: 'limit',
		required: false,
		example: 10,
		description: 'Limit of users to fetch (max 10)',
	})
	@ApiQuery({
		name: 'offset',
		required: false,
		example: 0,
		description: 'Number of users to skip',
	})
	@ApiQuery({
		name: 'nomeUser',
		required: false,
		example: '',
		description: 'Filter by user name',
	})
	findAllUsers(@Query() filter: FilterDto) {
		return this.userService.getAll(filter);
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Find current user' })
	@UseGuards(AuthTokenGuard)
	findCurrentUser(@TokenPayload() tokenPayload: PayloadDto) {
		return this.userService.getUser(tokenPayload);
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Find a user by ID' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'Users identifier',
	})
	findMUserById(@Param('id') id: string) {
		return this.userService.getOne(id);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Create a new user' })
	createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Update user' })
	updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
		return this.userService.update(body, id);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Delete user' })
	@ApiParam({
		name: 'id',
		example: 'dtpysooc8k9p2mk6f09rv5ro',
		description: 'User identifier',
	})
	deleteUser(@Param('id') id: string) {
		return this.userService.delete(id);
	}
}
