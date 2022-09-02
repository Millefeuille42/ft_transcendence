import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {FriendsService} from "../friends/friends.service";
import {InjectRepository} from "@nestjs/typeorm";
import {EBlocked} from "../user/user.interface";
import {Repository} from "typeorm";

@Injectable()
export class BlockedService {
	constructor(private readonly userService: UserService,
				private readonly tmp_db: TmpDbService,
				@Inject(forwardRef(() => FriendsService))
				private friendService: FriendsService,
				@InjectRepository(EBlocked) private blockedListRepository: Repository<EBlocked>) {}

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
		const user = await this.userService.getUser(login)

		const blocks = user.blocked
		if (blocks.length === 0)
			return { thereIsBlocked: false}
		return {
			thereIsBlocked: true,
			listOfBlocked: blocks,
		};
	}

	async addBlock(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		const blocks = user.blocked
		if (blocks.find(b => b === block) || block === login)
			throw new BadRequestException()
		blocks.push(block)
		if (await this.friendService.isFriend(block, login))
			await this.friendService.deleteFriend(block, login);
		if (await this.friendService.isFriend(login, block))
			await this.friendService.deleteFriend(login, block)
	}

	async deleteBlock(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		const blocks = user.blocked
		if (!(blocks.find(b => b === block)) || block === login)
			throw new BadRequestException()
		user.blocked = blocks.filter(b => b !== block);
	}

	async isBlocked(login: string, block: string) {
		await this.verificationUsers(login, block)
		const user = await this.userService.getUser(login)

		const blocks = user.blocked
		if (blocks.find(b => b === block))
			return true
		return false
	}
}
