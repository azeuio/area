import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { DatabaseModule } from 'src/firebase/database/database.module';
import { AuthModule } from 'src/firebase/auth/auth.module';

@Module({
  controllers: [AreaController],
  providers: [AreaService],
  imports: [DatabaseModule, AuthModule],
})
export class AreaModule {}
