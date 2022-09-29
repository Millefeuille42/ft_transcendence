import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {ConfigService} from "@nestjs/config";
import {UserModule} from "../user/user.module";
import {ItemsModule} from "../items/items.module";
import {GameModule} from "../game/game.module";

@Module({
	imports:[UserModule, ItemsModule, GameModule],
	controllers:[AuthController],
	providers:[AuthService, ConfigService],
	exports:[AuthService]
})
export class AuthModule {}
