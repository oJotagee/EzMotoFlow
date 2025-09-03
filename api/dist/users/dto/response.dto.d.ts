export declare class ResponseFindUserDto {
    id: string;
    name: string;
    email: string;
    created_at: Date | null;
    updated_at: Date | null;
}
export declare class ResponseCreateUserDto {
    id: string;
    name: string;
    email: string;
    created_at: Date | null;
    updated_at: Date | null;
}
export declare class ResponseUpdateUserDto {
    id: string;
    name: string;
    email: string;
}
export declare class ResponseDeleteUserDto {
    message: string;
}
export declare class PaginatedUsersResponseDto {
    data: ResponseFindUserDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
