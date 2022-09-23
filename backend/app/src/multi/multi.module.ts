import { Module } from '@nestjs/common';
import { MultiService } from './multi.service';
import {MultiGateway} from "./multi.gateway";
import {GameModule} from "../game/game.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [GameModule, AuthModule],
  providers: [MultiService, MultiGateway]
})
export class MultiModule {}
