import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify/spotify.service';
import { ConfigModule } from '@nestjs/config';
import { ServicesController } from './services.controller';
import { AuthModule } from '../firebase/auth/auth.module';
import { DatabaseModule } from '../firebase/database/database.module';
import { ServicesService } from './services.service';
import { BoardsModule } from '../boards/boards.module';
import { UsersModule } from '../users/users.module';
import { GmailService } from './gmail/gmail.service';

@Module({
  providers: [SpotifyService, ServicesService, GmailService],
  imports: [
    ConfigModule,
    AuthModule,
    DatabaseModule,
    BoardsModule,
    UsersModule,
  ],
  controllers: [ServicesController],
})
export class ServicesModule {}
