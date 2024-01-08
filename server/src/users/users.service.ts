import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../firebase/database/database.service';
import { User } from './entities/users.entity';
import { AuthService } from '../firebase/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auth: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.database.pushData(this.database.usersRefId, createUserDto);
  }

  async findAll() {
    return this.database.getData<Map<string, User>>(this.database.usersRefId);
  }

  async findOne(id: string) {
    const user = await this.database.getData<User>(
      this.database.usersRefId + '/' + id,
    );
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.database.updateData(
      this.database.usersRefId + '/' + id,
      updateUserDto,
    );
  }

  async remove(id: string) {
    return this.auth.unregister(id);
  }

  async setCredential(
    id: string,
    serviceId: string,
    credentials: object,
  ): Promise<void> {
    this.database.setData(
      this.database.usersRefId + '/' + id + '/credentials/' + serviceId,
      credentials,
    );
  }

  async getCredential(id: string, serviceId: string): Promise<object> {
    return this.database.getData<object>(
      this.database.usersRefId + '/' + id + '/credentials/' + serviceId,
    );
  }

  async removeCredential(id: string, serviceId: string): Promise<void> {
    this.database.removeData(
      this.database.usersRefId + '/' + id + '/credentials/' + serviceId,
    );
  }
}
