import {forwardRef, Module} from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import {UserModule} from "../user/user.module";
import { Items } from "../entities/items.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {EquipmentEntity, InventoryEntity} from "../entities/inventory.entity";
import {GameModule} from "../game/game.module";

@Module({
  imports: [forwardRef(() => UserModule), GameModule,
    TypeOrmModule.forFeature([Items, InventoryEntity, EquipmentEntity])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
