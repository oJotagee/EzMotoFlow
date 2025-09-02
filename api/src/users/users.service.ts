import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HashingProtocol } from 'src/auth/hash/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
	ResponseCreateUserDto,
	ResponseDeleteUserDto,
	ResponseFindUserDto,
	ResponseUpdateUserDto,
} from './dto/response.dto';
import { FilterDto } from './dto/filter.dto';

// import * as fs from 'node:fs';
// import * as path from 'node:path';

@Injectable()
export class UsersService {
	constructor(
		private prismaService: PrismaService,
		private hashingService: HashingProtocol,
	) {}

	async getAll(filter: FilterDto): Promise<ResponseFindUserDto[]> {
		try {
			const { limit = 6, offset = 0, nomeUser } = filter;

			const users = await this.prismaService.users.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					created_at: true,
					updated_at: true,
				},
				where: {
					...(filter.nomeUser && {
						name: {
							contains: nomeUser,
							mode: 'insensitive',
						},
					}),
				},
				take: limit,
				skip: offset,
				orderBy: {
					created_at: 'asc',
				},
			});

			return users;
		} catch (error) {
			throw new HttpException(
				'Failed to get all users',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getUser(tokenPayload: PayloadDto): Promise<ResponseFindUserDto> {
		try {
			const findUser = await this.prismaService.users.findFirst({
				where: { id: tokenPayload.sub },
				select: {
					id: true,
					name: true,
					email: true,
					created_at: true,
					updated_at: true,
				},
			});

			if (!findUser)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);

			return findUser;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}

			throw new HttpException(
				'Failed to get user',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async create(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto> {
		try {
			const existingByEmail = await this.prismaService.users.findUnique({
				where: { email: createUserDto.email },
			});

			if (existingByEmail)
				throw new HttpException(
					'A user with this email address is already registered.',
					HttpStatus.CONFLICT,
				);

			const passwordHash = await this.hashingService.hash(
				createUserDto.password,
			);

			const user = await this.prismaService.users.create({
				data: {
					name: createUserDto.name,
					email: createUserDto.email,
					password: passwordHash,
				},
				select: {
					id: true,
					name: true,
					email: true,
					created_at: true,
					updated_at: true,
				},
			});

			return user;
		} catch (error) {
			throw new HttpException(
				'Failed to create user',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(
		updateUserDto: UpdateUserDto,
		tokenPayload: PayloadDto,
	): Promise<ResponseUpdateUserDto> {
		try {
			const existingByEmail = await this.prismaService.users.findFirst({
				where: {
					email: updateUserDto.email,
				},
			});

			if (existingByEmail && existingByEmail.id !== tokenPayload.sub)
				throw new HttpException(
					'A user with this email address is already registered.',
					HttpStatus.CONFLICT,
				);

			const findUser = await this.prismaService.users.findFirst({
				where: {
					id: tokenPayload.sub,
				},
			});

			if (!findUser)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);

			if (findUser.id !== tokenPayload.sub)
				throw new HttpException(
					'You cannot update this user',
					HttpStatus.FORBIDDEN,
				);

			const dataUser: { name?: string; email?: string; password?: string } = {
				name: updateUserDto.name ? updateUserDto.name : findUser.name,
				email: updateUserDto.email ? updateUserDto.email : findUser.email,
			};

			if (updateUserDto.password) {
				const passwordHash = await this.hashingService.hash(
					updateUserDto.password,
				);
				dataUser.password = passwordHash;
			}

			const user = await this.prismaService.users.update({
				where: {
					id: findUser.id,
				},
				data: {
					...dataUser,
					password: dataUser.password ? dataUser.password : findUser.password,
					updated_at: new Date(),
				},
				select: {
					id: true,
					name: true,
					email: true,
				},
			});

			return user;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}

			throw new HttpException(
				'Failed to update user',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async delete(tokenPayload: PayloadDto): Promise<ResponseDeleteUserDto> {
		try {
			const findUser = await this.prismaService.users.findFirst({
				where: {
					id: tokenPayload.sub,
				},
			});

			if (!findUser)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			if (findUser.id !== tokenPayload.sub)
				throw new HttpException(
					'You cannot delete this user',
					HttpStatus.FORBIDDEN,
				);

			this.prismaService.users.delete({
				where: {
					id: findUser.id,
				},
			});

			return {
				message: 'User deleted successfully',
			};
		} catch (error) {
			throw new HttpException(
				'Failed to delete user',
				error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
