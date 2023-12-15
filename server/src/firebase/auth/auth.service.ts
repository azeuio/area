import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DatabaseService } from '../database/database.service';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  async getUidFromRequest(req: Request) {
    const token = req.headers.authorization.split('Bearer ')[1];
    return await this.getUidFromToken(token);
  }

  async getUidFromToken(token: string) {
    try {
      const decodedToken = await this.database.getAuth().verifyIdToken(token);
      return decodedToken.uid;
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async genereteEmailVerificationLink(uid: string) {
    const user = await this.database.getAuth().getUser(uid);
    return await this.database
      .getAuth()
      .generateEmailVerificationLink(user.email);
  }

  async register(email: string, password: string) {
    const user = await this.database
      .getAuth()
      .createUser({ email, password } as admin.auth.CreateRequest);
    await this.database.setData(`${this.database.usersRefId}/${user.uid}`, {
      email,
      username: email,
    });
    return user;
  }

  async createUser(uid: string, body: CreateUserDto) {
    const user = await this.database.getAuth().getUser(uid);
    await this.database.setData(`${this.database.usersRefId}/${uid}`, {
      email: user.email,
      username: body.username,
    });
  }

  async unregister(token: string) {
    let uid: string;
    try {
      const decodedToken = await this.database.getAuth().verifyIdToken(token);
      await this.database.getAuth().getUser(decodedToken.uid);
      uid = decodedToken.uid;
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    await Promise.all([
      this.database.getAuth().deleteUser(uid),
      this.database.removeData(`users/${uid}`),
    ]);
  }

  async checkToken(token: string) {
    try {
      return await this.database.getAuth().verifyIdToken(token);
    } catch (e) {
      return false;
    }
  }
}
