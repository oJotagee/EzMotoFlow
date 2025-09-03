export class ResponseFindUserDto {
	id: string;
	name: string;
	email: string;
	created_at: Date | null;
	updated_at: Date | null;
}

export class ResponseCreateUserDto {
	id: string;
	name: string;
	email: string;
	created_at: Date | null;
	updated_at: Date | null;
}

export class ResponseUpdateUserDto {
	id: string;
	name: string;
	email: string;
}

export class ResponseDeleteUserDto {
	message: string;
}

export class PaginatedUsersResponseDto {
	data: ResponseFindUserDto[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}

// export class ResponseUpdateAvatarDto {
// 	id: string;
// 	name: string;
// 	email: string;
// 	avatar: string | null;
// }
