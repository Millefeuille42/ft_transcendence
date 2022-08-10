import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [UserModule, TmpDbModule],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
