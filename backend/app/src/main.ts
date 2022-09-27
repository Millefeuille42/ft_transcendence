import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {json} from "express";

async function bootstrap() {
	const frontAddress = process.env.HOST + ":" + process.env.PORT_FRONT
	const devAddress = process.env.HOST + ":1234"
	const whiteList = [frontAddress, devAddress]
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.use(json({limit: '50mb'}))
	app.enableCors({
		credentials: true,
		origin: (requestOrigin, callback) => {
			if (!requestOrigin || whiteList.indexOf(requestOrigin) !== -1) {
				callback(null, requestOrigin)
			} else {
				callback(null, false)
			}
		},
		allowedHeaders: "content-type",
		methods: ["PATCH, DELETE"]
	  });
	await app.listen(process.env.PORT);
}
bootstrap();
