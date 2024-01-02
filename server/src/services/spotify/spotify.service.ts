import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { SpotifyUserDto } from './dto/spotifyUser.dto';
import { SpotifyTokenDto } from './dto/token.dto';

type SetVolumeResponse =
  | number
  | { error: { status: number; message: string } };
@Injectable()
export class SpotifyService {
  readonly apiURL: string = 'https://accounts.spotify.com/api';
  readonly clientID: string =
    this.configService.get<string>('SPOTIFY_CLIENT_ID');
  readonly clientSecret: string = this.configService.get<string>(
    'SPOTIFY_CLIENT_SECRET',
  );

  constructor(private configService: ConfigService) {}

  async fetch(
    url: string,
    token: SpotifyTokenDto,
    options?: RequestInit,
  ): Promise<Response> {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    // refresh token if expired
    if (res.status === HttpStatus.UNAUTHORIZED) {
      const newToken = await this.refreshToken(token.refresh_token);
      return await this.fetch(url, newToken, options);
    }
    return res;
  }

  async refreshToken(refreshToken: string) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${this.clientID}:${this.clientSecret}`,
        ).toString('base64')}`,
      },
    });
    const json = await res.json();
    return json;
  }

  private generateRandomString(length: number) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; ++i) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async getAuthorizationURL(redirectUri: string) {
    if (!redirectUri) {
      return;
    }
    const state = this.generateRandomString(16);
    const scope =
      'user-read-currently-playing user-read-email user-modify-playback-state';

    const url =
      `https://accounts.spotify.com/authorize?` +
      qs.stringify({
        response_type: 'code',
        client_id: this.clientID,
        scope: scope,
        redirect_uri: redirectUri || 'http://localhost:3000/',
        state: state,
        // show_dialog: true,
      });
    return url;
  }

  async getToken(code: string, redirectUri: string) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${this.clientID}:${this.clientSecret}`,
        ).toString('base64')}`,
      },
    });
    const json = await res.json();
    return json;
  }

  async getUserProfile(token: SpotifyTokenDto): Promise<SpotifyUserDto> {
    const res = await this.fetch('https://api.spotify.com/v1/me', token, {
      method: 'GET',
    });
    const json = await res.json();
    return json;
  }

  async getArtist(id: string, token: SpotifyTokenDto) {
    const res = await this.fetch(
      `https://api.spotify.com/v1/artists/${id}`,
      token,
      {
        method: 'GET',
      },
    );
    const json = await res.json();
    return json;
  }

  async getUserPlaying(token: SpotifyTokenDto) {
    const res = await this.fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      token,
      {
        method: 'GET',
      },
    );
    if (res.status === HttpStatus.NO_CONTENT) {
      // Playback not available or active (i.e. nothing is playing)
      return null;
    }
    try {
      const json = await res.json();
      return json;
    } catch (e) {
      console.log(res.status, res.statusText, res.body);

      if (res.status === HttpStatus.NOT_FOUND) {
        if (e.reason === 'NO_ACTIVE_DEVICE') {
          return null;
        }
      }
      throw e;
    }
  }

  async setVolume(
    token: SpotifyTokenDto,
    volume: number,
  ): Promise<SetVolumeResponse> {
    const volumeFixed = volume.toFixed(0);

    const res = await this.fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumeFixed}`,
      token,
      {
        method: 'PUT',
      },
    );
    if (res.status === HttpStatus.NO_CONTENT) {
      return parseInt(volumeFixed);
    }
    const json = await res.json();
    return json;
  }
}
