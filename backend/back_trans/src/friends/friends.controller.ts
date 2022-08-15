import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {FriendsService} from "./friends.service";

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService,
				private readonly userService: UserService) {}

	@Get(':login')
	friendList(@Param('login') login: string) {
		return (this.friendsService.friendList(login));
	}

	@Get(':login/:friend')
	isFriend(@Param('login') login: string, @Param('friend') friend: string) {
		if (!(this.userService.users.find(user => user.login === friend)))
			return ("Login doesn't exist")
		return (this.friendsService.isFriend(login, friend));
	}

	@Post(':login/:friend')
	addFriend(@Param('login') login: string, @Param('friend') friend: string) {
		if (!(this.userService.users.find(user => user.login === friend)))
			return ("Login doesn't exist")
		this.friendsService.addFriend(login, friend);
	}

	@Delete(':login/:friend')
	deleteFriend(@Param('login') login: string, @Param('friend') friend: string) {
		if (!(this.userService.users.find(user => user.login === friend)))
			return ("Login doesn't exist")
		this.friendsService.deleteFriend(login, friend);
	}

	@Get(':login/:friend/online')
	isFriendOnline(@Param('login') login: string, @Param('friend') friend: string) {
		if (!(this.userService.users.find(user => user.login === friend)))
			return ("Login doesn't exist")
		if (this.friendsService.isFriend(login, friend) == false)
			return ('Not a friend')
		return (this.userService.isOnline(friend));
	}
}
