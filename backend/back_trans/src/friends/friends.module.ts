import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
