import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Items {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	rarity: number

	@Column()
	category: string

	@Column()
	name: string

	@Column()
	description: string
}