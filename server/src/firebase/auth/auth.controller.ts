import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/auth.dto';
import { AuthGuard, AuthGuardVerifiedEmail } from './auth.guard';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('generate-verification-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '<link-to-verify-email>',
    type: String,
  })
  async generateVerificationEmail(@Req() req: any) {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await this.authService.checkToken(token);
    if (!decodedToken) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.genereteEmailVerificationLink(decodedToken.uid);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: '<uid-of-the-user>',
    type: String,
  })
  async register(@Body() signUpDto: SignUpDto) {
    return (
      await this.authService.register(signUpDto.email, signUpDto.password)
    ).uid;
  }

  @HttpCode(HttpStatus.OK)
  @Post('create-user')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  async createUser(@Req() req: Request, @Body() body: CreateUserDto) {
    const uid = await this.authService.getUidFromRequest(req);
    await this.authService.createUser(uid, body);
    return 'OK';
  }

  @HttpCode(HttpStatus.OK)
  @Post('unregister')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: String,
  })
  async unregister(@Req() req: any) {
    const token = req.headers.authorization.split('Bearer ')[1];
    await this.authService.unregister(token);
    return 'User deleted';
  }
}
