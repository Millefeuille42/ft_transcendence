import {forwardRef, Module} from '@nestjs/common';
import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {FriendsModule} from "../friends/friends.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EBlocked} from "../user/user.interface";
import {RelationsEntity} from "../entities/relations.entity";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule, forwardRef(() => FriendsModule),
    TypeOrmModule.forFeature([RelationsEntity])],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService]
})
export class BlockedModule {}
