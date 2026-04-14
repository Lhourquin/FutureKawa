import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';

@Module({
  imports: [SharedModule],
  controllers: [LotsController],
  providers: [LotsService],
})
export class LotsModule {}
