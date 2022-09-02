import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {EUser} from "./user.interface";

@Entity()
export class UsersList {
	@PrimaryGeneratedColumn('uuid')
	id: number

	@Column()
	login: string

	@Column(() => EUser)
	user: EUser
}