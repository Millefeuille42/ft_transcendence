import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import { JwtModule } from '@nestjs/jwt'
import {ConfigService} from "@nestjs/config";
import {UserModule} from "../user/user.module";
import {jwtConstants} from "./constants";

@Module({
	imports:[UserModule,
	JwtModule.register({
		secret: jwtConstants.secret,
	})],
	controllers:[AuthController],
	providers:[AuthService, JwtService, ConfigService],
})
export class AuthModule {}