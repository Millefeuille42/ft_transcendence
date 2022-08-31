import {Body, Controller, Get, Param, Patch, Res} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./create-user.dto";
import {Response} from "express";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('online/:login')
	getOnlineList(@Param('login') login: string) {
		return (this.userService.listOfOnlinePeople(login))
	}

	/**
	 * @api {get} user/username/:username Get User if username exist
	 * @apiName isUsernameExist
	 * @apiGroup User
	 *
	 * @apiParam username Username that need a check
	 *
	 * @apiSuccess {Json} userExist Boolean set to false if username doesn't exist
	 * @apiSuccess {Json} login if <code>userExist</code> is true, the login of the user
	 */
	@Get('username/:username')
	isUsernameExist(@Param('username') username: string) {
		return (this.userService.isUsernameExist(username))
	}

	/**
	 * @api {get} /user/:login/:resource Request information about a User
	 * @apiName getUser
	 * @apiGroup User
	 *
	 * @apiParam login Login of user
	 * @apiParam resource Infomation needed about <code>login</code>. (<code>profile</code>, <code>name</code>, <code>email</code>, <code>avatar</code>, <code>banner</code>, <code>username</code>, <code>online</code>)
	 *
	 * @apiSuccess {Json} profile All informations about <code>login</code>
	 * @apiSuccess {String} name Full name of <code>login</code>
	 * @apiSuccess {String} email Email of <code>login</code>
	 * @apiSuccess {String} avatar Aatar's link of <code>login</code>
	 * @apiSuccess {String} banner Banner's link <code>login</code>
	 * @apiSuccess {String} username Username of <code>login</code>
	 * @apiSuccess {Boolean} online True if <code>login</code> is online
	 */
	@Get('/:login/:resource')
	getUser(@Param('login') login: string,
			@Param('resource') resource: string) {
		if (resource === 'profile')
			return (this.userService.getUser(login));
		if (resource === 'name')
			return (this.userService.getName(login));
		if (resource === 'email')
			return (this.userService.getMail(login));
		if (resource === 'avatar')
			return (this.userService.getAvatar(login));
		if (resource === 'banner')
			return (this.userService.getBanner(login));
		if (resource === 'username')
			return (this.userService.getUsername(login));
		if (resource === 'online')
			return (this.userService.isOnline(login));
	}

	/**
	 * @api {patch} user/:login Change information about a User
	 * @apiName changeUser
	 * @apiGroup User
	 *
	 * @apiParam login Login of user to change
	 *
	 * @apiBody {Boolean} online True if <code>login</code> is online
	 * @apiBody {String} avatar Link to the new avatar of <code>login</code>
	 * @apiBody {String} banner Link to the new banner of <code>login</code>
	 * @apiBody {String} username New username of <code>login</code>
	 *
	 * @apiSuccess {Json} changes New informations about <code>login</code>
	 */
	@Patch(':login/')
	changeUser(@Param('login') login: string,
			   @Body() change: CreateUserDto,
			   @Res() res: Response) {
		if (change.hasOwnProperty('online')) {
			this.userService.changeOnline(login, change)
			res.send (this.userService.isOnline(login))
		}
		if (change.avatar) {
			this.userService.changeAvatar(login, change)
			res.send (this.userService.getAvatar(login));
		}
		if (change.banner) {
			this.userService.changeBanner(login, change)
			res.send (this.userService.getBanner(login));
		}
		if (change.username) {
			this.userService.changeUsername(login, change)
			res.send (this.userService.getUsername(login));
		}
		return ;
	}
}
