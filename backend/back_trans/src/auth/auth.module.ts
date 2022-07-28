import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {ConfigService} from "@nestjs/config";
import {UserModule} from "../user/user.module";

@Module({
	imports:[UserModule],
	controllers:[AuthController],
	providers:[AuthService, ConfigService],
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