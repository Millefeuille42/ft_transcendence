import {forwardRef, Module} from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import { Items } from "./items.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule, TypeOrmModule.forFeature([Items])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
