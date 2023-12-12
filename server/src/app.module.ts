import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [FirebaseModule, BoardsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
