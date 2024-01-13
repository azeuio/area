import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Action } from './entities/action.entity';
import { CreateActionDto } from './dto/create-action.dto';

@Injectable()
export class ActionsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const actions = await this.db.getData<Map<string, Action>>(
      this.db.actionsRefId,
    );
    if (!actions) {
      return [];
    }
    return Object.entries(actions).map(([id, action]: [string, Action]) => ({
      id,
      ...action,
    }));
  }

  async findOne(id: string) {
    const action = await this.db.getData<Action>(
      this.db.actionsRefId + '/' + id,
    );
    if (!action) {
      throw new HttpException('Action not found', HttpStatus.NOT_FOUND);
    }
    return action;
  }

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
      return Object.entries(value).map(([id, action]: [string, Action]) => ({
        id,
        ...action,
      }));
    }
    return [];
  }

  async create(action: CreateActionDto) {
    const actionWithoutId = { ...action };
    delete actionWithoutId.id;
    if (!action.id) {
      action.id = this.db.getRef('actions').push().key;
    } else {
      if (
        (await this.db.getRef('actions').child(action.id).get()).exists() ===
        true
      ) {
        throw new HttpException('Action already exists', HttpStatus.CONFLICT);
      }
    }
    console.log('action', action);

    const ref = await this.db.getRef(this.db.actionsRefId + '/' + action.id);
    await ref.set(actionWithoutId);
    return action;
  }
}
