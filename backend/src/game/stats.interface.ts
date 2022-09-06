import {Column, Entity, PrimaryColumn} from "typeorm";

export interface history {
	login: string,
	rival: string,
	userPoints: number,
	rivalPoints: number,
	gameMode: string,
}

export interface stats {
	total: number,
	wins: number,
	looses: number,
	points: number,
	lastRival: string,
	history: history[],
}

@Entity()
export class EStats {
	@PrimaryColumn()
	login: string

	@Column({type: "text"})
	total: number
	@Column({type: "text"})
	wins: number
	@Column({type: "text"})
	looses: number
	@Column({type: "text"})
	points: number
	@Column()
	lastRival: string
	@Column(() => EHistory, {array: true})
	history: EHistory[]
}

@Entity()
export class EHistory {
	@PrimaryColumn()
	login: string

	@Column()
	rival: string
	@Column({type: "text"})
	userPoints: number
	@Column({type: "text"})
	rivalPoints: number
	@Column()
	gameMode:string
}