import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, TableInheritance} from "typeorm";
import {UsersList} from "./users.entity";
import {MessagesEntity} from "./messages.entity";

@Entity()
export abstract class ChannelsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column("uuid",{array: true})
	users: number[]

	@ManyToMany(() => MessagesEntity)
	@JoinTable()
	messages: MessagesEntity[]
}
