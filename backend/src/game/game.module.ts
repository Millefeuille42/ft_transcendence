import {forwardRef, Module} from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
