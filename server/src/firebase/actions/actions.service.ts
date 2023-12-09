import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Action } from './entities/action.entity';

@Injectable()
export class ActionsService {
  constructor(private db: DatabaseService) {}

  async findFromService(serviceId: string) {
    if (
      (await this.db.getRef('services').child(serviceId).get()).exists() ===
      false
    ) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    const actions = this.db
      .getRef('actions')
      .orderByChild('service_id')
      .equalTo(serviceId);
    const snapshot = await actions.once('value');
    const value: Action[] | null = snapshot.val();
    if (value) {
      return Object.values(value);
    }
    return [];
  }
}
