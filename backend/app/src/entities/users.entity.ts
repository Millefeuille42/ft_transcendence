import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UsersList {
	@PrimaryGeneratedColumn('uuid')
	id: number

	@Column()
	login: string

	@Column()
	email: string

	@Column()
	username: string

	@Column()
	name: string

	@Column()
	avatar: string

	@Column()
	banner: string

	@Column()
	online: boolean
}