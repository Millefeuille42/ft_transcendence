export class CreateUser {
	readonly email: string;
	readonly login: string;
	readonly name: string;
	readonly avatar: string;
}

export class CreateUserDto {
	readonly email?: string;
	readonly login?: string;
	readonly username?: string;
	readonly name?: string;
	readonly avatar?: string;
	readonly banner?: string;
	readonly online?: boolean;
}