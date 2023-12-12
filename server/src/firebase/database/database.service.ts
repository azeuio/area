import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import credentials from '../credentials.json';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public readonly dbURL =
    'https://area-25011-default-rtdb.europe-west1.firebasedatabase.app';

  private app: admin.app.App;
  private db: admin.database.Database;
  private auth: admin.auth.Auth;

  public readonly usersRefId = 'users';
  public readonly servicesRefId = 'services';
  public readonly actionsRefId = 'actions';
  public readonly boardsRefId = 'boards';

  onModuleInit() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(credentials as admin.ServiceAccount),
      databaseURL: this.dbURL,
    });
    this.db = admin.database();
    this.auth = admin.auth();
  }

  getApp() {
    return this.app;
  }

  public getDatabase() {
    return this.db;
  }

  public getAuth() {
    return this.auth;
  }

  getRef(path: string) {
    return this.db.ref(path);
  }

  async getData<T>(path: string): Promise<T> {
    const dataSnapshot = await this.db.ref(path).once('value');
    return dataSnapshot.val();
  }

  async setData<T>(path: string, data: T, onComplete?: (a: Error) => void) {
    await this.db.ref(path).set(data, onComplete);
  }

  async updateData<T>(path: string, data: T, onComplete?: (a: Error) => void) {
    await this.db.ref(path).update(data, onComplete);
  }

  async pushData<T>(path: string, data: T, onComplete?: (a: Error) => void) {
    return await this.db.ref(path).push(data, onComplete);
  }

  async removeData(path: string, onComplete?: (a: Error) => void) {
    await this.db.ref(path).remove(onComplete);
  }
}
