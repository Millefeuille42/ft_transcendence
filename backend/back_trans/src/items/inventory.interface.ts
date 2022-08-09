import {ItemsInterface} from "./items.interface";

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