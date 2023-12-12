import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
  imports: [DatabaseModule],
})
export class ServicesModule {}
