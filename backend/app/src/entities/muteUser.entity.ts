import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {RealChannelEntity} from "./realChannel.entity";

@Entity()
export class MuteUserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column('uuid')
	userId: number

	@Column({type:'timestamptz'})
	endOfMute: Date

	@ManyToOne(() => RealChannelEntity)
	@JoinColumn()
	channel: RealChannelEntity
}