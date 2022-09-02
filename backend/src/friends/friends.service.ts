import {BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";
import {BlockedService} from "../blocked/blocked.service";

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService,
				private readonly tmp_db: TmpDbService,
				@Inject(forwardRef(() => BlockedService))
				private blockedService: BlockedService) {}

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

		const friends = user.friends;
		if (friends.length === 0)
			return { thereIsFriend: false}
		return {
			thereIsFriend: true,
			listOfFriends: friends,
		};
	}

	async addFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		const friends = user.friends
		if (friends.find(f => f === friend) || friend === login)
			throw new BadRequestException()
		if (await this.blockedService.isBlocked(friend, login))
			throw new HttpException("Friend blocked User", HttpStatus.FORBIDDEN)
		friends.push(friend);
	}

	async deleteFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		let friends = user.friends;
		if (!(friends.find(f => f === friend)) || friend === login)
			throw new BadRequestException()
		user.friends = friends.filter(f => f !== friend)
	}

	async isFriend(login: string, friend: string) {
		await this.verificationUsers(login, friend)
		const user = await this.userService.getUser(login)

		const friends = user.friends
		if (friends.find(f => f === friend))
			return true
		return false
	}
}
