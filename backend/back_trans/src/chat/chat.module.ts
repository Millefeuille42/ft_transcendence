import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';

@Module({
	providers: [ChatGateway, ConfigService],
  })
export class ChatModule {}
