import {equipped, inventory} from "../items/inventory.interface";
import {stats} from "../game/stats.interface";

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
	readonly friends?: Array<string>;
	readonly blocked?: Array<string>;
	readonly inventory?: inventory;
	readonly equipped?: equipped;
	readonly stats?: stats;
}