import { TokenPayload } from 'src/auth/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UsersService } from './users.service';
import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Find a user' })
	@UseGuards(AuthTokenGuard)
	findOneUser(@TokenPayload() tokenPayload: PayloadDto) {
		return this.userService.getUser(tokenPayload);
	}

	@Post()
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Create a user' })
	createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Update a user' })
	updateUser(
		@Body() body: UpdateUserDto,
		@TokenPayload() tokenPayload: PayloadDto,
	) {
		return this.userService.update(body, tokenPayload);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(AuthTokenGuard)
	@ApiOperation({ summary: 'Delete a user' })
	deleteUser(@TokenPayload() tokenPayload: PayloadDto) {
		return this.userService.delete(tokenPayload);
	}

	// @Post('upload')
	// @ApiBearerAuth()
	// @UseGuards(AuthTokenGuard)
	// @ApiConsumes('multipart/form-data')
	// @UseInterceptors(FileInterceptor('file'))
	// @ApiOperation({ summary: 'Update avatar' })
	// @ApiBody({
	// 	schema: {
	// 		type: 'object',
	// 		properties: {
	// 			file: {
	// 				type: 'string',
	// 				format: 'binary',
	// 			},
	// 		},
	// 	},
	// })
	// uploadAvatar(
	// 	@TokenPayload() tokenPayload: PayloadDto,
	// 	@UploadedFile(
	// 		new ParseFilePipeBuilder()
	// 			.addFileTypeValidator({
	// 				fileType: /jpeg|jpg|png/g,
	// 			})
	// 			.addMaxSizeValidator({
	// 				maxSize: 5 * (1024 * 1024),
	// 			})
	// 			.build({
	// 				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
	// 			}),
	// 	)
	// 	file: Express.Multer.File,
	// ): Promise<ResponseUpdateAvatarDto> {
	// 	return this.userService.uploadAvatarFile(file, tokenPayload);
	// }
}
