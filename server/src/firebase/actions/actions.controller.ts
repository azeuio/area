import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateActionDto } from './dto/create-action.dto';

@ApiTags('Actions')
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}
  @Get('from-service/:service_id')
  @ApiOperation({ summary: 'Get actions from service' })
  async findOne(@Param('service_id') serviceId: string) {
    return await this.actionsService.findFromService(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get action by id' })
  async findOneById(@Param('id') id: string) {
    return await this.actionsService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all actions' })
  async findAll() {
    return await this.actionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create action' })
  @ApiProperty({
    description: 'Create action. If id is not provided, it will be generated.',
    type: CreateActionDto,
  })
  async create(@Body() createActionDto: CreateActionDto) {
    return await this.actionsService.create(createActionDto);
  }
}
