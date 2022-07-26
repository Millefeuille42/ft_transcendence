import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BanUserEntity} from "../entities/banUser.entity";
import {MuteUserEntity} from "../entities/muteUser.entity";
import {DmChannelEntity} from "../entities/dmChannel.entity";
import {MessagesEntity} from "../entities/messages.entity";
import {RealChannelEntity} from "../entities/realChannel.entity";
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {BlockedModule} from "../blocked/blocked.module";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
	imports: [
		ScheduleModule.forRoot(),
		TypeOrmModule.forFeature([
			BanUserEntity,
			MuteUserEntity,
			DmChannelEntity,
			MessagesEntity,
			RealChannelEntity]),
		UserModule,
		AuthModule,
		BlockedModule
	],
	providers: [ChatGateway, ConfigService, ChatService],
	controllers: [ChatController]
  })
export class ChatModule {}
