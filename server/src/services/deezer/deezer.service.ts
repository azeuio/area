import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';

interface DeezerUserDto {
  id: number;
  name: string;
  lastname: string;
  firstname: string;
  email: string;
  status: number;
  birthday: string;
  inscription_date: string;
  gender: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  country: string;
  lang: string;
  is_kid: boolean;
  explicit_content_level: string;
  explicit_content_levels_available: string[];
  tracklist: string;
}

@Injectable()
export class DeezerService {
  readonly apiURL: string = 'https://connect.deezer.com/oauth';
  readonly appId: string = this.config.get<string>('DEEZER_APP_ID');
  readonly secretKey: string = this.config.get<string>('DEEZER_SECRET_KEY');
  constructor(private readonly config: ConfigService) {}

  async getAuthorizationURL(redirectUri: string) {
    if (!redirectUri) {
      return;
    }
    return (
      'https://connect.deezer.com/oauth/auth.php?' +
      qs.stringify({
        app_id: this.appId,
        redirect_uri: redirectUri,
        perms: 'basic_access,manage_library,email,listening_history',
        response_type: 'code',
      })
    );
  }

  async getToken(code: string, redirectUri: string) {
    if (!code || !redirectUri) {
      return;
    }
    const response = await fetch(
      'https://connect.deezer.com/oauth/access_token.php?' +
        qs.stringify({
          app_id: this.appId,
          secret: this.secretKey,
          code,
          output: 'json',
        }),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    try {
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async getUser(token: string): Promise<DeezerUserDto | null> {
    if (!token) {
      return null;
    }
    const response = await fetch(
      `https://api.deezer.com/user/me?` +
        qs.stringify({
          access_token: token,
        }),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    try {
      const data = await response.json();
      return data as DeezerUserDto;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createPlaylist(token: string, name: string) {
    if (!token || !name) {
      return;
    }
    try {
      const user = await this.getUser(token).catch((e) => console.error(e));
      if (!user) {
        return;
      }
      const userId = user.id;
      if (!userId) {
        return;
      }
      const response = await fetch(
        `https://api.deezer.com/user/${userId}/playlists?` +
          qs.stringify({
            access_token: token,
            title: name,
          }),
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
