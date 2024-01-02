export class User {
  username: string;
  email: string;
  credentials?: {
    spotify?: {
      code: string;
      token: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        token_type: string;
      };
    };
  };
}
