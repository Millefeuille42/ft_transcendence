import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class RelationsEntity {
	@PrimaryColumn('uuid')
	id: number

	@Column()
	otherLogin: string

	@Column()
	friend: boolean

	@Column()
	blocked: boolean
}