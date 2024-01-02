import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/firebase/database/database.module';
import { AuthModule } from 'src/firebase/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, AuthModule],
  exports: [UsersService],
})
export class UsersModule {}
