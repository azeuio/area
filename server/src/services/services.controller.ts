import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpotifyService } from './spotify/spotify.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly spotifyService: SpotifyService) {}

  //// vv SPOTIFY vv ////
  @Get('spotify/auth')
  @ApiOperation({
    summary: 'Get Spotify authorization URL',
    description: 'Returns Spotify authorization URL',
  })
  async spotifyAuth(@Query('redirect_uri') redirectUri: string) {
    return this.spotifyService.getAuthorizationURL(redirectUri);
  }

  @Get('spotify/token')
  async spotifyToken(
    @Query('code') code: string,
    @Query('redirect_uri') redirectUri: string,
  ) {
    return this.spotifyService.getToken(code, redirectUri);
  }
  //// ^^ SPOTIFY ^^ ////
}
