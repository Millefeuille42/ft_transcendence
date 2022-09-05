import {forwardRef, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersList} from "../entities/users.entity";
import {FriendsModule} from "../friends/friends.module";
import {BlockedModule} from "../blocked/blocked.module";
import {EBlocked, EFriend} from "./user.interface";
import {ItemsModule} from "../items/items.module";
import {GameModule} from "../game/game.module";

@Module({
  imports: [TmpDbModule, TypeOrmModule.forFeature([UsersList, EBlocked, EFriend]),
    forwardRef(() => FriendsModule), forwardRef(() => BlockedModule),
    forwardRef(() => ItemsModule), forwardRef(() => GameModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
