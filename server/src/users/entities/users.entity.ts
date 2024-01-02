import { ApiProperty } from '@nestjs/swagger';

export class UserCredentials {
  token: string;
}

export class User {
  email: string;
  username: string;
  // map service_id to user credentials
  @ApiProperty({
    type: Map<string, UserCredentials>,
    example: { google: { token: '123' } },
  })
  credentials: Map<string, UserCredentials>;
}
