import {
	BadRequestException,
	Body,
	Controller, Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res, UnauthorizedException
} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUser, CreateUserDto} from "./create-user.dto";
import {Response} from "express";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('online/:login')
	async getOnlineList(@Param('login') login: string) {
		return (await this.userService.listOfOnlinePeople(login))
	}

	@Post()
	async createNewUser(@Body() user: CreateUser) {
		if (!user.hasOwnProperty('login')
			|| !user.hasOwnProperty('email')
			|| !user.hasOwnProperty('name')
			|| !user.hasOwnProperty('avatar'))
			throw new BadRequestException("Some fields are missing")
		return await this.userService.initUser(user)
	}

	@Get()
	async getUsers() {
		return await this.userService.getAllUsers()
	}

	@Get('ping')
	async ping() {
		return ('pong')
	}

	@Get('byuser/:usertoget/:login')
	async getUserByUser(@Param('login') login: string,
						@Param('usertoget') user: string) {
		return this.userService.getUserByUser(login, user)
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
	async getUser(@Param('login') login: string,
			@Param('resource') resource: string) {
		if (resource === 'profile')
			return (await this.userService.getUser(login));
		if (resource === 'name')
			return (await this.userService.getName(login));
		if (resource === 'email')
			return (await this.userService.getMail(login));
		if (resource === 'avatar')
			return (await this.userService.getAvatar(login));
		if (resource === 'banner')
			return (await this.userService.getBanner(login));
		if (resource === 'username')
			return (await this.userService.getUsername(login));
		if (resource === 'online')
			return (await this.userService.isOnline(login));
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
	async changeUser(@Param('login') login: string,
			   @Body() change: CreateUserDto,
			   @Res() res: Response) {

		let user = await this.userService.getUser(login)
		let newChange = {
			online: user.online,
			avatar: user.avatar,
			banner: user.banner,
			username: user.username
		}
		if (!change.hasOwnProperty('online')
			&& !change.hasOwnProperty('avatar')
			&& !change.hasOwnProperty('banner')
			&& !change.hasOwnProperty('username'))
			throw new HttpException("Nothing to change", HttpStatus.BAD_REQUEST)
		if (change.hasOwnProperty('online')) {
			await this.userService.changeOnline(login, change)
			newChange.online = change.online
		}
		if (change.avatar) {
			await this.userService.changeAvatar(login, change)
			newChange.avatar = change.avatar
		}
		if (change.banner) {
			await this.userService.changeBanner(login, change)
			newChange.banner = change.banner
		}
		if (change.username) {
			await this.userService.changeUsername(login, change)
			newChange.username = change.username
		}
		res.send(newChange)
		return ;
	}

	@Patch('disconnect/:login')
	async disconnectUser(@Param('login') login: string) {
		return await this.userService.disconnectUser(login)
	}

	@Get('twofa/status/:login')
	async get2FAStatus(@Param('login') login: string) {
		return this.userService.isTwoFA(login)
	}

	@Post('twofa/:login')
	async enableTwoFA(@Param('login') login: string) {
		return await this.userService.generateTwoFA(login)
	}

	@Patch('twofa/:login/:code')
	async activateTwoFA(@Param('login') login: string,
						@Param('code') code: string) {
		if (!await this.userService.twoFAIsValid(login, code))
			throw new UnauthorizedException()
		await this.userService.changeOnline(login, {online: true})
		return await this.userService.enabledTwoFA(login)
	}

	@Delete('twofa/:login/:code')
	async deleteTwoFA(@Param('login') login: string,
					  @Param('code') code: string) {
		return await this.userService.deleteTwoFA(login, code)
	}
}
