import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class StatsEntity {
	@PrimaryColumn('uuid')
	id: number

	@Column()
	total: number

	@Column()
	wins: number

	@Column()
	looses: number

	@Column()
	points: number

	@Column()
	lastRival: string
}