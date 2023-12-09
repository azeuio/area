import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [ActionsController],
  providers: [ActionsService],
  imports: [DatabaseModule],
})
export class ActionsModule {}
