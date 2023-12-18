import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { BoardsModule } from './boards/boards.module';
import { AreaModule } from './area/area.module';

@Module({
  imports: [FirebaseModule, BoardsModule, AreaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
