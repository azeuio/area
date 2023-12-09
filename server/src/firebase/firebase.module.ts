import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  controllers: [],
  providers: [],
  imports: [DatabaseModule, ActionsModule],
  exports: [DatabaseModule],
})
export class FirebaseModule {}
