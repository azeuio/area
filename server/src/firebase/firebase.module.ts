import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  controllers: [],
  providers: [],
  imports: [ServicesModule, DatabaseModule, AuthModule, ActionsModule],
  exports: [ServicesModule, DatabaseModule, AuthModule],
})
export class FirebaseModule {}
