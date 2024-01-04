import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardIsOwner } from '../firebase/auth/auth.guard';
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

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuardIsOwner('id', {
      isNotUser: 'You can only access your own account',
    }),
  )
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuardIsOwner('id'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuardIsOwner('id'))
  async remove(@Req() req: Request) {
    const token = req.headers.authorization.split('Bearer ')[1];
    return this.usersService.remove(token);
  }
}
