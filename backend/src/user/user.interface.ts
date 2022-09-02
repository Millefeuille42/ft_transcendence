import {EEquipped, EInventory, equipped, inventory} from "../items/inventory.interface";
import {EStats, stats} from "../game/stats.interface"
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

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

export interface UserGlobal {
	login: string;
	username: string;
	avatar: string;
	banner: string;
	stats: stats;
}

@Entity()
export class EUser {
	@PrimaryColumn()
	login: string

	@Column()
	email: string;
	@Column()
	username: string;
	@Column()
	name: string;
	@Column()
	avatar: string;
	@Column()
	banner: string;
	@Column()
	online: boolean;
	@Column("text", {array: true})
	friends: string[];
	@Column("text", {array: true})
	blocked: string[];
	@Column(() => EInventory)
	inventory: EInventory;
	@Column(() => EEquipped)
	equipped: EEquipped;
	@Column(() => EStats)
	stats: EStats;
}

@Entity()
export class EFriend {
	@PrimaryColumn()
	login: string

	@Column()
	loginFriend: string
}

@Entity()
export class EBlocked {
	@PrimaryColumn()
	login: string

	@Column()
	loginBlocked: string
}