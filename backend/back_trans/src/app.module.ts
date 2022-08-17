import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import {IsAuthMiddleware} from "./middlewares/isAuth.middleware";
import {SetCorsHeaderMiddleware} from "./middlewares/set-cors-header.middleware";
import {AppLoggerMiddleware} from "./middlewares/app-logger.middleware";
import { FriendsModule } from './friends/friends.module';
import { ItemsModule } from './items/items.module';
import { ChatModule } from './chat/chat.module';
import { TmpDbModule } from './tmp_db/tmp_db.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    UserModule,
    FriendsModule,
    ItemsModule,
	ChatModule,
    TmpDbModule,
    GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware, SetCorsHeaderMiddleware).forRoutes('*')
    consumer.apply(IsAuthMiddleware).forRoutes('profile', 'user', 'friends', 'items')
  }
}
