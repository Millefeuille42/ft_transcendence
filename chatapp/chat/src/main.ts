import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
//   var join: any;
//   app.useStaticAssets(join(__dirname, '..', 'static'));
//   app.setBaseViewsDir(join(__dirname, '..', 'views'));
//   app.setViewEngine('ejs');
}
bootstrap();
