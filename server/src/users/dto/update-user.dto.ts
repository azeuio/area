import { PartialType } from '@nestjs/swagger';
import { User } from '../entities/users.entity';

export class UpdateUserDto extends PartialType(User) {}
