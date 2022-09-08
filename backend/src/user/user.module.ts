import {forwardRef, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersList} from "../entities/users.entity";
import {FriendsModule} from "../friends/friends.module";
import {BlockedModule} from "../blocked/blocked.module";
import {ItemsModule} from "../items/items.module";
import {GameModule} from "../game/game.module";

@Module({
  imports: [TypeOrmModule.forFeature([UsersList]),
    forwardRef(() => FriendsModule), forwardRef(() => BlockedModule),
    forwardRef(() => ItemsModule), forwardRef(() => GameModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
