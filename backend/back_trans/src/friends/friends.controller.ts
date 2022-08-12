import {BadRequestException, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {FriendsService} from "./friends.service";

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService,
				private readonly userService: UserService) {}

	/**
	 * @api {get} /friends/:login Request the friend list
	 * @apiName friendList
	 * @apiGroup Friends
	 *
	 * @apiParam {String} login Login of the current user
	 *
	 * @apiSuccess {String[]} friends The list with all friends
	 *
	 * @apiError NotFoundException User (<code>login</code>) not found
	 */
	@Get(':login')
	friendList(@Param('login') login: string) {
		return (this.friendsService.friendList(login));
	}

	/**
	 * @api {get} /friends/:login/:friend Request if the other user is friend
	 * @apiName isFriend
	 * @apiGroup Friends
	 *
	 * @apiParam {String} login Login of the current user
	 * @apiParam {String} friend Login of the friend
	 *
	 * @apiSuccess {Boolean} res True if the other user is in the list of friends
	 *
	 * @apiError NotFoundException User (<code>login</code>) or friend (<code>friend</code>) not found
	 */
	@Get(':login/:friend')
	isFriend(@Param('login') login: string, @Param('friend') friend: string) {
		return (this.friendsService.isFriend(login, friend));
	}

	/**
	 * @api {post} /friends/:login/:friend Add a friend
	 * @apiName addFriend
	 * @apiGroup Friends
	 *
	 * @apiParam {String} login Login of the current user
	 * @apiParam {String} friend Login of the friend
	 *
	 * @apiError NotFoundException User (<code>login</code>) or friend (<code>friend</code>) not found
	 * @apiError BadRequestException <code>friend</code> is already in the list of friends or is the same then <code>login</code>
	 */
	@Post(':login/:friend')
	addFriend(@Param('login') login: string, @Param('friend') friend: string) {
		this.friendsService.addFriend(login, friend);
	}

	/**
	 * @api {delete} /friends/:login/:friend Remove a friend
	 * @apiName deleteFriend
	 * @apiGroup Friends
	 *
	 * @apiParam {String} login Login of the current user
	 * @apiParam {String} friend Login of the friend
	 *
	 * @apiError NotFoundException User (<code>login</code>) or friend (<code>friend</code>) not found
	 * @apiError BadRequestException <code>friend</code> is not in the list of friends or is the same then <code>login</code>
	 */
	@Delete(':login/:friend')
	deleteFriend(@Param('login') login: string, @Param('friend') friend: string) {
		this.friendsService.deleteFriend(login, friend);
	}

	/**
	 * @api {get} /friends/:login/:friend/online Request if the friend is online
	 * @apiName isFriendOnline
	 * @apiGroup Friends
	 *
	 * @apiParam {String} login Login of the current user
	 * @apiParam {String} friend Login of the friend
	 *
	 * @apiSuccess {Boolean} res True if the friend is online
	 *
	 * @apiError NotFoundException User (<code>login</code>) or friend (<code>friend</code>) not found
	 * @apiError BadRequestException <code>friend</code> is not in the list of friends
	 */
	@Get(':login/:friend/online')
	isFriendOnline(@Param('login') login: string, @Param('friend') friend: string) {
		this.friendsService.verificationUsers(login, friend)
		if (this.friendsService.isFriend(login, friend) == false)
			throw new BadRequestException()
		return (this.userService.isOnline(friend));
	}
}
