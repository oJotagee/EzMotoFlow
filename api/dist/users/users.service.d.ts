import { HashingProtocol } from 'src/auth/hash/hashing.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseCreateUserDto, ResponseDeleteUserDto, ResponseFindUserDto, ResponseUpdateUserDto } from './dto/response.dto';
export declare class UsersService {
    private prismaService;
    private hashingService;
    constructor(prismaService: PrismaService, hashingService: HashingProtocol);
    getUser(tokenPayload: PayloadDto): Promise<ResponseFindUserDto>;
    create(createUserDto: CreateUserDto): Promise<ResponseCreateUserDto>;
    update(updateUserDto: UpdateUserDto, tokenPayload: PayloadDto): Promise<ResponseUpdateUserDto>;
    delete(tokenPayload: PayloadDto): Promise<ResponseDeleteUserDto>;
}
