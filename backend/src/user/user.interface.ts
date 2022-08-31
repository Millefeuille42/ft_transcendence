import {equipped, inventory} from "../items/inventory.interface";
import {stats} from "../game/stats.interface"

export interface User {
	email?: string;
	login?: string;
	username?: string;
	name?: string;
	avatar?: string;
	banner?: string;
	online?: boolean;
	friends?: Array<string>;
	blocked?: Array<string>;
	inventory?: inventory;
	equipped?: equipped;
	stats?: stats;
}