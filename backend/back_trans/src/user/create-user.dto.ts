import {equipped, inventory} from "../items/inventory.interface";

export class CreateUserDto {
	readonly email?: string;
	readonly login?: string;
	readonly username?: string;
	readonly name?: string;
	readonly avatar?: string;
	readonly banner?: string;
	readonly online?: boolean;
	readonly friends?: Array<string>;
	readonly inventory?: inventory;
	readonly equipped?: equipped;
}