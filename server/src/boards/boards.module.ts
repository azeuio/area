import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { DatabaseModule } from 'src/firebase/database/database.module';
import { AuthModule } from 'src/firebase/auth/auth.module';
import { AreaModule } from 'src/area/area.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [DatabaseModule, AuthModule, AreaModule, UsersModule],
  exports: [BoardsService],
})
export class BoardsModule {}
