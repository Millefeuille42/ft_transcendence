import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MessagesEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column('uuid')
	userId: number

	@Column()
	userLogin: string

	@Column()
	type: string

	@Column()
	roomId: number

	@Column()
	content: string

	@CreateDateColumn()
	createAd: Date
}