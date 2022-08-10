import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class Chat {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@CreateDateColumn()
	createAt: Date;
}