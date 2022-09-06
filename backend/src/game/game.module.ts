import {forwardRef, Module} from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StatsEntity} from "../entities/stats.entity";
import {HistoryEntity} from "../entities/history.entity";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule,
  TypeOrmModule.forFeature([StatsEntity, HistoryEntity])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
