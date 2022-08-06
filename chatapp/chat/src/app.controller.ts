import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Chat } from './chat.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

	@Get()
	getHello() {
		return ("nique ta daronne");
	}

}
