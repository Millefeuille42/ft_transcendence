import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService,
				private readonly tmp_db: TmpDbService) {}

	verificationUsers(login: string, friend?: string) {
		if (!(this.tmp_db.users.find(user => user.login === login)))
			throw new HttpException('User not found', HttpStatus.NOT_FOUND)
		if (!friend)
			return ;
		if (!(this.tmp_db.users.find(user => user.login === friend)))
			throw new HttpException('Friend not found', HttpStatus.NOT_FOUND)
	}

	friendList(login: string) {
		this.verificationUsers(login)

		const friends = this.tmp_db.users.find(users => users.login === login).friends;
		if (friends.length === 0)
			return { thereIsFriend: false}
		return {
			thereIsFriend: true,
			listOfFriends: friends,
		};
	}

	addFriend(login: string, friend: string) {
		this.verificationUsers(login, friend)

		const friends = this.tmp_db.users.find(users => users.login === login).friends
		if (friends.find(f => f === friend) || friend === login)
			throw new BadRequestException()
		friends.push(friend);
	}

	deleteFriend(login: string, friend: string) {
		this.verificationUsers(login, friend)

		let friends = this.tmp_db.users.find(users => users.login === login).friends;
		if (!(friends.find(f => f === friend)) || friend === login)
			throw new BadRequestException()
		this.tmp_db.users.find(users => users.login === login).friends = friends.filter(f => f !== friend)
	}

	isFriend(login: string, friend: string) {
		this.verificationUsers(login, friend)
		const friends = this.tmp_db.users.find(users => users.login === login).friends
		if (friends.find(f => f === friend))
			return true
		return false
	}
}
