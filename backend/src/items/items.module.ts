import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [UserModule, TmpDbModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
