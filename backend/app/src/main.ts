import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const frontAddress = process.env.HOST + ":" + process.env.PORT_FRONT
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.enableCors({
		credentials: true,
		origin: frontAddress,
		allowedHeaders: "content-type",
		methods: ["PATCH, DELETE"]
	  });
	await app.listen(process.env.PORT);
}
bootstrap();
