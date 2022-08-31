import {Body, Controller, Param, Post} from '@nestjs/common';
import {GameService} from "./game.service";

@Controller('game')
export class GameController {
	constructor(readonly private gameService: GameService) {}

	@Post(':login')
	addStats(@Param('login') login,
			 @Body() result: string,
			 @Body() rival: string) {

	}
}
