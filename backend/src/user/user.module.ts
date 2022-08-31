import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [TmpDbModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
