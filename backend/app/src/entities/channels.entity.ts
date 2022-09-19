import {Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, TableInheritance} from "typeorm";
import {UsersList} from "./users.entity";
import {MessagesEntity} from "./messages.entity";

@Entity()
export abstract class ChannelsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToMany(() => UsersList)
	@JoinTable()
	users: UsersList[]

	@ManyToMany(() => MessagesEntity)
	@JoinTable()
	messages: MessagesEntity[]
}
