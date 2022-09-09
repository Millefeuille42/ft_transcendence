import {EItems, ItemsInterface} from "./items.interface";
import {Column, Entity, PrimaryColumn} from "typeorm";

export interface inventory {
	rod: ItemsInterface[];
	ball: ItemsInterface[];
	sound: ItemsInterface[];
}

export interface equipped {
	rod: ItemsInterface;
	ball: ItemsInterface;
	sound: ItemsInterface;
}

@Entity()
export class EInventory {
	@PrimaryColumn()
	login: string

	@Column(() => EItems, {array: true})
	rod: EItems[]
	@Column(() => EItems, {array: true})
	ball: EItems[]
	@Column(() => EItems, {array: true})
	sound: EItems[]
}

@Entity()
export class EEquipped {
	@PrimaryColumn()
	login: string

	@Column(() => EItems)
	rod: EItems
	@Column(() => EItems)
	ball: EItems
	@Column(() => EItems)
	sound: EItems
}