import { Controller, Get, Param } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Actions')
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}
  @Get(':service_id')
  async findOne(@Param('service_id') serviceId: string) {
    return await this.actionsService.findFromService(serviceId);
  }
}
