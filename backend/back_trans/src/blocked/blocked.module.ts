import { Module } from '@nestjs/common';
import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [UserModule, TmpDbModule],
  controllers: [BlockedController],
  providers: [BlockedService]
})
export class BlockedModule {}
