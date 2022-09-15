import {Column, Entity, OneToMany} from "typeorm";
import {ChannelsEntity} from "./channels.entity";
import {BanUserEntity} from "./banUser.entity";
import {MuteUserEntity} from "./muteUser.entity";

@Entity()
export class RealChannelEntity extends ChannelsEntity {
	@Column({unique: true})
	name: string

	@Column()
	public: boolean

	@Column({default: ""})
	password: string

	@Column('uuid')
	ownerId: number

	@Column('uuid', {array: true})
	adminId: number

	@OneToMany(() => BanUserEntity, (user) => user.channel, {eager: true})
	ban: BanUserEntity[]

	@OneToMany(() => MuteUserEntity, (user) => user.channel, {eager: true})
	mute: MuteUserEntity[]
}