import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { DatabaseService } from '../database/database.service';
import { Service } from './entities/service.entity';
import { FindAllServiceDto } from './dto/find-all-service.dto';
import { User } from '../auth/entities/user.dto';

@Injectable()
export class ServicesService {
  constructor(private database: DatabaseService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.database.pushData(
      this.database.servicesRefId,
      createServiceDto,
    );
  }

  async findAll() {
    const services = await this.database.getData<FindAllServiceDto>(
      this.database.servicesRefId,
    );
    return services;
  }

  async findOne(id: string) {
    const service = await this.database.getData<Service>(
      this.database.servicesRefId + '/' + id,
    );
    return service;
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.database.updateData(
      this.database.servicesRefId + '/' + id,
      updateServiceDto,
    );
  }

  remove(id: string) {
    return this.database.removeData(this.database.servicesRefId + '/' + id);
  }

  async findAllActiveServicesForUser(uid: string) {
    const user = await this.database.getData<User>(
      this.database.usersRefId + '/' + uid,
    );
    const services = await this.findAll();

    return Object.entries(services || {})
      .filter(([_, service]) => user.credentials?.[service.name.toLowerCase()])
      .map(([id, service]) => Object.assign({ id }, service));
  }
}
