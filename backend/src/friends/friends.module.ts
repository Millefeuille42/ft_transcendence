import {forwardRef, Module} from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {BlockedModule} from "../blocked/blocked.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EFriend} from "../user/user.interface";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule, BlockedModule,
    TypeOrmModule.forFeature([EFriend])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService]
})
export class FriendsModule {}
