import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UsersService } from './users.service';
import { FilterDto } from './dto/filter.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    fintAllContract(Filter: FilterDto): Promise<import("./dto/response.dto").ResponseFindUserDto[]>;
    findOneUser(tokenPayload: PayloadDto): Promise<import("./dto/response.dto").ResponseFindUserDto>;
    createUser(body: CreateUserDto): Promise<import("./dto/response.dto").ResponseCreateUserDto>;
    updateUser(body: UpdateUserDto, tokenPayload: PayloadDto): Promise<import("./dto/response.dto").ResponseUpdateUserDto>;
    deleteUser(tokenPayload: PayloadDto): Promise<import("./dto/response.dto").ResponseDeleteUserDto>;
}
