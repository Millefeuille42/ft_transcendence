import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {ConfigService} from "@nestjs/config";
import {UserModule} from "../user/user.module";
import {ItemsModule} from "../items/items.module";

@Module({
	imports:[UserModule, ItemsModule],
	controllers:[AuthController],
	providers:[AuthService, ConfigService],
})
export class AuthModule {}