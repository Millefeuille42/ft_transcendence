import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export interface ItemsInterface {
	id: number;
	rarity: number;
	category: string;
	name: string;
	description: string;
}

@Entity()
export class EItems {
	@PrimaryGeneratedColumn()
	id: number

	@Column({type: "text"})
	rarity: number

	@Column()
	category: string

	@Column()
	name: string

	@Column()
	description: string;
}