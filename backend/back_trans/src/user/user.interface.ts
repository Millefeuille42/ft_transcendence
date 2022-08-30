import {equipped, inventory} from "../items/inventory.interface";

export interface User {
	email?: string;
	login?: string;
	username?: string;
	name?: string;
	avatar?: string;
	banner?: string;
	online?: boolean;
	friends?: Array<string>;
	inventory?: inventory;
	equipped?: equipped;
}