import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import {IsAuthMiddleware} from "./middlewares/isAuth.middleware";
import {AppLoggerMiddleware} from "./middlewares/app-logger.middleware";
import { FriendsModule } from './friends/friends.module';
import { ItemsModule } from './items/items.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { BlockedModule } from './blocked/blocked.module';
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
      ChatModule,
    UserModule,
    FriendsModule,
    ItemsModule,
	ChatModule,
    GameModule,
    BlockedModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
    consumer.apply(IsAuthMiddleware).forRoutes('user', 'friends', 'items', 'blocked', 'game', 'chat')
  }
}
