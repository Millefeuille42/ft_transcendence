import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {CreateChannelDto} from "./create-channel.dto";
import {BanOrMuteDto} from "./ban-or-mute.dto";

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Get('channels')
	getAllChannels() {

	}

	@Get('channels/:channel')
	getOneChannel(@Param('channel') channel: string) {

	}

	@Get('channels/:channel/public')
	async isPublic(@Param('channel') channel: string) {
		return await this.chatService.isPublic(channel)
	}

	@Get('channel/:login')
	getChannelsOfUser(@Param('login') login: string) {

	}

	@Get('dm/:login')
	getDmOfUser(@Param('login') login: string) {

	}

	@Get('channel/ban/:channel')
	banList(@Param('channel') channel: string) {

	}

	@Get('channel/mute/:channel')
	muteList(@Param('channel') channel: string) {

	}

	@Get('channel/admin/:channel')
	adminList(@Param('channel') channel: string) {

	}

	@Post('channel')
	createChannel(@Body() newChannel: CreateChannelDto) {
		return this.chatService.createChannel(newChannel)
	}

	@Post('channel/ban')
	banSomeone(@Body() banInfo: BanOrMuteDto) {

	}

	@Post('channel/mute')
	muteSomeone(@Body() muteInfo: BanOrMuteDto) {

	}
}
