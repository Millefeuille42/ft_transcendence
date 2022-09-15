import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class RelationsEntity {
	@PrimaryGeneratedColumn()
	relationId: number

	@Column('uuid')
	id: number

	@Column()
	otherLogin: string

	@Column()
	friend: boolean

	@Column()
	blocked: boolean
}