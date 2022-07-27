import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtService} from "@nestjs/jwt";
import { JwtModule } from '@nestjs/jwt'
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UserModule} from "../user/user.module";

@Module({
	imports:[UserModule],
	controllers:[AuthController],
	providers:[AuthService, JwtService, ConfigService],
})
export class AuthModule {}

// Pouet
// [y] -> (x)
// [mlabouri] -> (asfhisdfjasdhi)
// [ericard] -> (fafsdgsgsghsdgs)

// ----

// Cookies:
// [String] -> (String)
// [Session] -> (mlabouri)
// [Session] -> (ericard)

// CookieJar, ... , ...