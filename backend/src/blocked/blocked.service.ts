import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {FriendsService} from "../friends/friends.service";

@Injectable()
export class BlockedService {
	constructor(private readonly userService: UserService,
				private readonly tmp_db: TmpDbService,
				@Inject(forwardRef(() => FriendsService))
				private friendService: FriendsService) {}

	verificationUsers(login: string, block?: string) {
		if (!(this.tmp_db.users.find(user => user.login === login)))
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		if (!block)
			return ;
		if (!(this.tmp_db.users.find(user => user.login === block)))
			throw new HttpException('User to block not found', HttpStatus.NOT_FOUND)
	}

	blockedList(login: string) {
		this.verificationUsers(login)

		const blocks = this.tmp_db.users.find(users => users.login === login).blocked
		if (blocks.length === 0)
			return { thereIsBlocked: false}
		return {
			thereIsBlocked: true,
			listOfBlocked: blocks,
		};
	}

	addBlock(login: string, block: string) {
		this.verificationUsers(login, block)

		const blocks = this.tmp_db.users.find(users => users.login === login).blocked
		if (blocks.find(b => b === block) || block === login)
			throw new BadRequestException()
		blocks.push(block)
		if (this.friendService.isFriend(block, login))
			this.friendService.deleteFriend(block, login);
		if (this.friendService.isFriend(login, block))
			this.friendService.deleteFriend(login, block)
	}

	deleteBlock(login: string, block: string) {
		this.verificationUsers(login, block)

		const us = this.tmp_db.users.find(users => users.login === login)
		const blocks = us.blocked
		if (!(blocks.find(b => b === block)) || block === login)
			throw new BadRequestException()
		us.blocked = blocks.filter(b => b !== block);
	}

	isBlocked(login: string, block: string) {
		this.verificationUsers(login, block)

		const blocks = this.tmp_db.users.find(users => users.login === login).blocked
		if (blocks.find(b => b === block))
			return true
		return false
	}
}
