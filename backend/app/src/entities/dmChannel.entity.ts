import {Column, Entity} from "typeorm";
import {ChannelsEntity} from "./channels.entity";

@Entity()
export class DmChannelEntity extends ChannelsEntity {
	// @Column()
	// isDm: boolean
}