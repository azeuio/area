import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AboutJsonDto } from './dto/about.json.dto';
import { DatabaseService } from './firebase/database/database.service';

@Controller()
export class AppController {
  constructor(private databaseService: DatabaseService) {}

  @Get('about.json')
  async getAbout(@Req() req: Request): Promise<AboutJsonDto> {
    const services = await this.databaseService.getData('services');
    const actions = await this.databaseService.getData('actions');
    const serviceNames = Object.keys(services).map((key) => {
      return services[key].name;
    });
    const servicesDto = serviceNames.map((serviceName) => {
      const serviceId = Object.keys(services).find(
        (key) => services[key].name === serviceName,
      );
      const serviceActions = Object.keys(actions)
        .filter((key) => actions[key].service_id === serviceId)
        .map((key) => {
          return {
            name: actions[key].name,
            description: actions[key].description,
            isATrigger: actions[key].is_a_trigger,
          };
        });
      return {
        name: serviceName,
        actions: serviceActions
          .filter((action) => action.isATrigger)
          .map((action) => {
            const actionWOTrigger = { ...action };
            delete actionWOTrigger.isATrigger;
            return actionWOTrigger;
          }),
        reactions: serviceActions
          .filter((action) => !action.isATrigger)
          .map((action) => {
            const actionWOTrigger = { ...action };
            delete actionWOTrigger.isATrigger;
            return actionWOTrigger;
          }),
      };
    });

    return {
      client: {
        host: req.ip,
      },
      server: {
        current_time: Date.now(),
        services: servicesDto,
      },
    };
  }
}
