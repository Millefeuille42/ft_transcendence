import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {FriendsService} from "../friends/friends.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RelationsEntity} from "../entities/relations.entity";

@Injectable()
export class BlockedService {
	constructor(@Inject(forwardRef(() => UserService))
				private userService: UserService,
				@Inject(forwardRef(() => FriendsService))
				private friendService: FriendsService,
				@InjectRepository(RelationsEntity) private relationsRepository: Repository<RelationsEntity>) {}

	async verificationUsers(login: string, block?: string) {
		let user = await this.userService.getUser(login)
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		if (!block)
			return ;
		user = await this.userService.getUser(block)
		if (!user)
			throw new HttpException('User to block not found', HttpStatus.NOT_FOUND)
	}

	async blockedList(login: string) {
		await this.verificationUsers(login)
		const user = await this.userService.getUser(login)

		const blocks = await this.relationsRepository.find({
			where: {
				id: user.id,
				blocked: true
			}
		})
		if (blocks.length === 0)
			return { thereIsBlocked: false}
		let listOfBlocked = new Array<String>()
		blocks.forEach(f => {
			listOfBlocked.push(f.otherLogin)
		})
		return {
			thereIsBlocked: true,
			listOfBlocked: listOfBlocked,
		};
	}

	async addBlock(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		if (block === login)
			throw new BadRequestException("Login and blocked can't be the same")
		let relation
		let alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: block})
		if (alreadyRelation && alreadyRelation.blocked === true)
			throw new HttpException("Already blocked", HttpStatus.FORBIDDEN)
		if (await this.friendService.isFriend(login, block))
			await this.friendService.deleteFriend(login, block)
		if (await this.friendService.isFriend(block, login))
			await this.friendService.deleteFriend(block, login)
		if (alreadyRelation)
			relation = await this.relationsRepository.preload({relationId: alreadyRelation.relationId, blocked: true})
		else
			relation = {
				id: user.id,
				otherLogin: block,
				friend: false,
				blocked: true
			}
		return await this.relationsRepository.save(relation)
	}

	async deleteBlock(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		if (block === login)
			throw new BadRequestException("Login and blocked can't be the same")
		let alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: block})
		if (!alreadyRelation || (alreadyRelation && alreadyRelation.blocked === false))
			throw new BadRequestException()
		let relation = await this.relationsRepository.preload({relationId: alreadyRelation.relationId, blocked: false})
		return await this.relationsRepository.save(relation)
	}

	async isBlocked(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		const alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: block})
		if (alreadyRelation && alreadyRelation.blocked === true)
			return true
		return false
	}
}
