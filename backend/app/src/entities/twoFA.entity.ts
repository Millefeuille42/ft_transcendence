import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class TwoFAEntity {
	@PrimaryColumn('uuid')
	id: number

	@Column()
	twoFASecret: string

	@Column({default: false})
	isEnabled: boolean
}