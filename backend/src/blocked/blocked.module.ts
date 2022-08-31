import {forwardRef, Module} from '@nestjs/common';
import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {FriendsModule} from "../friends/friends.module";

@Module({
  imports: [UserModule, TmpDbModule, forwardRef(() => FriendsModule)],
  controllers: [BlockedController],
  providers: [BlockedService],
  exports: [BlockedService]
})
export class BlockedModule {}
