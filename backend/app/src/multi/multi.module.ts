import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MultiGateway } from './multi.gateway';

@Module({
	providers: [MultiGateway, ConfigService],
  })
export class MultiModule {}
