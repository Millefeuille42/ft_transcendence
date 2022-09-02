import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.interface";

@Entity()
export class UsersList {
	@PrimaryGeneratedColumn('uuid')
	id: number

	@Column()
	login: string

	@Column()
	user: User
}