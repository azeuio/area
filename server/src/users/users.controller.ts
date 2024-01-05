import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/firebase/auth/auth.service';
import { Request } from 'express';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auth: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  async findOne(@Req() req: Request) {
    const uid = await this.auth.getUidFromRequest(req);
    return this.usersService.findOne(uid);
  }

  @Patch()
  @ApiBearerAuth()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const uid = await this.auth.getUidFromRequest(req);
    return this.usersService.update(uid, updateUserDto);
  }

  @Delete()
  @ApiBearerAuth()
  async remove(@Req() req: Request) {
    const token = req.headers.authorization.split('Bearer ')[1];
    return this.usersService.remove(token);
  }
}
