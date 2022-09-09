import {forwardRef, Module} from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import {UserModule} from "../user/user.module";
import {BlockedModule} from "../blocked/blocked.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RelationsEntity} from "../entities/relations.entity";

@Module({
  imports: [forwardRef(() => UserModule), BlockedModule,
    TypeOrmModule.forFeature([RelationsEntity])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService]
})
export class FriendsModule {}
