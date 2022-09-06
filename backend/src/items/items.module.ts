import {forwardRef, Module} from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import {UserModule} from "../user/user.module";
import {TmpDbModule} from "../tmp_db/tmp_db.module";
import { Items } from "../entities/items.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {EquipmentEntity, InventoryEntity} from "../entities/inventory.entity";

@Module({
  imports: [forwardRef(() => UserModule), TmpDbModule,
    TypeOrmModule.forFeature([Items, InventoryEntity, EquipmentEntity])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
