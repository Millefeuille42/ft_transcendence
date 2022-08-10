import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";
import {TmpDbService} from "../tmp_db/tmp_db.service";

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService,
				private readonly tmp_db: TmpDbService) {}

	friendList(login: string) {
		console.log(login)
		const friends = this.tmp_db.users.find(users => users.login === login).friends;
		if (friends.size === 0)
			return { thereIsFriend: false}
		return {
			thereIsFriend: true,
			listOfFriends: Array.from(friends),
		};
	}

	addFriend(login: string, friend: string) {
		const friends = this.tmp_db.users.find(users => users.login === login).friends;
		friends.add(friend);
		console.log(friend)
	}

	deleteFriend(login: string, friend: string) {
		let friends = this.tmp_db.users.find(users => users.login === login).friends;
		friends.delete(friend)
	}

	isFriend(login: string, friend: string) {
		const friends = this.tmp_db.users.find(users => users.login === login).friends
		return friends.has(friend);
	}
}
