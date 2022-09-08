import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {BlockedService} from "../blocked/blocked.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RelationsEntity} from "../entities/relations.entity";

@Injectable()
export class FriendsService {
	constructor(@Inject(forwardRef(() => BlockedService))
				private blockedService: BlockedService,
				@Inject(forwardRef(() => UserService))
				private userService: UserService,
				@InjectRepository(RelationsEntity) private relationsRepository: Repository<RelationsEntity>) {}

	async verificationUsers(login: string, friend?: string) {
		let user = await this.userService.getUser(login)
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		if (!friend)
			return ;
		user = await this.userService.getUser(friend)
		if (!user)
			throw new HttpException('Friend not found', HttpStatus.NOT_FOUND)
	}

	async friendList(login: string) {
		await this.verificationUsers(login)
		const user = await this.userService.getUser(login)

		const friends = await this.relationsRepository.find({
			where: {
				id: user.id,
				friend: true
			}
		})
		if (friends.length === 0)
			return { thereIsFriend: false}
		let listOfFriends = new Array<String>()
		friends.forEach(f => {
			listOfFriends.push(f.otherLogin)
		})
		return {
			thereIsFriend: true,
			listOfFriends: listOfFriends,
		};
	}

	async addFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		if (friend === login)
			throw new BadRequestException()
		let relation
		let alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: friend})
		if (alreadyRelation && alreadyRelation.friend === true)
			throw new HttpException("Already friends", HttpStatus.FORBIDDEN)
		if (alreadyRelation && alreadyRelation.blocked === true)
			throw new HttpException("User blocked Friend", HttpStatus.FORBIDDEN)
		if (await this.blockedService.isBlocked(friend, login))
			throw new HttpException("Friend blocked User", HttpStatus.FORBIDDEN)
		if (alreadyRelation)
			relation = await this.relationsRepository.preload({relationId: alreadyRelation.relationId, friend: true})
		else
			relation = {
				id: user.id,
				otherLogin: friend,
				friend: true,
				blocked: false
			}
		return await this.relationsRepository.save(relation)
	}

	async deleteFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		if (friend === login)
			throw new BadRequestException("Login and friend are the same")
		let alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: friend})
		if (!alreadyRelation || (alreadyRelation && alreadyRelation.friend === false))
			throw new BadRequestException()
		let relation = await this.relationsRepository.preload({relationId: alreadyRelation.relationId, friend: false})
		return await this.relationsRepository.save(relation)
	}

	async isFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		let alreadyRelation = await this.relationsRepository.findOneBy({id: user.id, otherLogin: friend})
		if (alreadyRelation && alreadyRelation.friend === true)
			return true
		return false
	}
}
