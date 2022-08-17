import { Module } from '@nestjs/common';
import { TmpDbService } from './tmp_db.service';

@Module({
  providers: [TmpDbService],
  exports: [TmpDbService]
})
export class TmpDbModule {}
