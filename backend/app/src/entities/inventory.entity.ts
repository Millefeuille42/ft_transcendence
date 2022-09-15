import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class InventoryEntity {
	@PrimaryColumn('uuid')
	id: number

	@Column("int",{array: true})
	rod: number[]

	@Column("int", {array: true})
	ball: number[]

	@Column("int",{array: true})
	sound: number[]
}

@Entity()
export class EquipmentEntity {
	@PrimaryColumn('uuid')
	id: number

	@Column()
	rod: number

	@Column()
	ball: number

	@Column()
	sound: number
}