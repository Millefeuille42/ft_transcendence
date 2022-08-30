import { Module } from '@nestjs/common';
import { BlockedController } from './blocked.controller';
import { BlockedService } from './blocked.service';
import {UserModule} from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [BlockedController],
  providers: [BlockedService]
})
export class BlockedModule {}
