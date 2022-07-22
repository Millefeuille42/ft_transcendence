import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function getToken() {
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await getToken();
	await app.listen(3000);
}
bootstrap();
