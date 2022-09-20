import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {CreateChannelDto} from "./create-channel.dto";
import {BanOrMuteDto} from "./ban-or-mute.dto";

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Get('channels')
	async getAllChannels() {
		return (await this.chatService.getAllChannels())
	}

	@Get('channel/:channel')
	async getOneChannel(@Param('channel') channel: string) {
		return (await this.chatService.getChannel(channel))
	}

	@Get('channel/user/:login')
	async getChannelsOfUser(@Param('login') login: string) {
		console.log("Got here")
		return (await this.chatService.getChannelsOfUser(login))
	}

	@Get('dm/user/:login')
	async getDmOfUser(@Param('login') login: string) {
		return (await this.chatService.getDmOfUser(login))
	}

	@Get('channel/ban/:channel')
	async banList(@Param('channel') channel: string) {
		return (await this.chatService.getBanList(channel))
	}

	@Get('channel/mute/:channel')
	async muteList(@Param('channel') channel: string) {
		return (await this.chatService.getMuteList(channel))
	}

	@Get('channel/admin/:channel')
	async adminList(@Param('channel') channel: string) {
		return (await this.chatService.getAdminList(channel))
	}

	@Post('channel')
	createChannel(@Body() newChannel: CreateChannelDto) {
		return this.chatService.createChannel(newChannel)
	}

	@Get('channel/public/:channel')
	async isPublic(@Param('channel') channel: string) {
		return this.chatService.isPublic(channel)
	}

	@Get('dm/:login/:other')
	async getDmIntoUsers(@Param('login') login: string,
						 @Param('other') other: string) {
		return (await this.chatService.getDm(login, other))
	}
}
