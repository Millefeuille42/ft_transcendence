import {StatsEntity} from "../entities/stats.entity";

export interface User {
	email?: string;
	login?: string;
	username?: string;
	name?: string;
	avatar?: string;
	banner?: string;
	online?: boolean;
}

export interface UserGlobal {
	login: string;
	username: string;
	avatar: string;
	banner: string;
	isInGame: boolean;
	stats: StatsEntity;
}