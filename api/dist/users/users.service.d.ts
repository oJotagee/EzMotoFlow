import { HashingProtocol } from 'src/auth/hash/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseCreateUserDto, ResponseDeleteUserDto, ResponseFindUserDto, ResponseUpdateUserDto, PaginatedUsersResponseDto } from './dto/response.dto';
import { FilterDto } from './dto/filter.dto';
export declare class UsersService {
    private prismaService;
    private hashingService;
    constructor(prismaService: PrismaService, hashingService: HashingProtocol);
    getAll(filter: FilterDto): Promise<PaginatedUsersResponseDto>;
    getUser(tokenPayload: PayloadDto): Promise<ResponseFindUserDto>;
    getOne(id: string): Promise<ResponseFindUserDto>;
    create(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto>;
    update(updateUserDto: UpdateUserDto, id: string): Promise<ResponseUpdateUserDto>;
    delete(id: string): Promise<ResponseDeleteUserDto>;
}
