import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import {IsAuthMiddleware} from "./middlewares/isAuth.middleware";

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    UserModule,
    ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(IsAuthMiddleware).forRoutes('profile')
  }
}
