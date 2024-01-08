import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardVerifiedEmail } from '../firebase/auth/auth.guard';
import { AuthService } from 'src/firebase/auth/auth.service';
import { Request } from 'express';
import { UserCredentials } from './entities/users.entity';

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

  @Post(':id/credentials/:serviceId')
  @ApiBearerAuth()
  @UseGuards(AuthGuardVerifiedEmail)
  async updateCredentials(
    @Param() params: { id: string; serviceId: string },
    @Body() updateUserDto: Partial<UserCredentials>,
  ) {
    return this.usersService.setCredential(
      params.id,
      params.serviceId,
      updateUserDto,
    );
  }

  @Get(':id/credentials/:serviceId')
  @ApiBearerAuth()
  @UseGuards(AuthGuardVerifiedEmail)
  async getCredentials(@Param() params: { id: string; serviceId: string }) {
    return this.usersService.getCredential(params.id, params.serviceId);
  }

  @Delete(':id/credentials/:serviceId')
  @ApiBearerAuth()
  @UseGuards(AuthGuardVerifiedEmail)
  async removeCredentials(@Param() params: { id: string; serviceId: string }) {
    return this.usersService.removeCredential(params.id, params.serviceId);
  }
}
