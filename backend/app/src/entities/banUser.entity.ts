import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {RealChannelEntity} from "./realChannel.entity";

@Entity()
export class BanUserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column('uuid')
	userId: number

	@Column({type:'timestamptz'})
	endOfBan: Date

	@ManyToOne(() => RealChannelEntity)
	@JoinColumn()
	channel: RealChannelEntity
}