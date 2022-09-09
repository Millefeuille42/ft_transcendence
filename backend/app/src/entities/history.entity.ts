import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class HistoryEntity {
	@PrimaryGeneratedColumn()
	id: number

	@PrimaryColumn('uuid')
	userId: number

	@Column()
	login: string

	@Column()
	rival: string

	@Column()
	userPoints: number

	@Column()
	rivalPoints: number

	@Column()
	mode: string
}