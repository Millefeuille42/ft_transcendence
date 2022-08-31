import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [UserModule, TmpDbModule],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
