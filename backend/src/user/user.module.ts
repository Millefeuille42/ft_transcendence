import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersList} from "./users.entity";

@Module({
  imports: [TmpDbModule, TypeOrmModule.forFeature([UsersList])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
