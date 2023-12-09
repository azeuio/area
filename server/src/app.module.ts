import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
