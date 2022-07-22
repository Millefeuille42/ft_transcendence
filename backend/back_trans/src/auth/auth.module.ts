import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Module({
	imports:[],
	controllers:[AuthController],
	providers:[AuthService, JwtService, ConfigService],
})
export class AuthModule {}