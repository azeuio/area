import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpotifyService } from './spotify/spotify.service';
import { GmailService } from './gmail/gmail.service';
import GmailTokenDTO from './dto/gmail-token.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly gmailService: GmailService,
  ) {}

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
  //// vv GMAIL vv ////
  @Get('gmail/auth')
  @ApiOperation({
    summary: 'Get Gmail authorization URL',
    description: 'Returns Gmail authorization URL',
  })
  async gmailAuth(@Query('redirect_uri') redirectUri: string) {
    return this.gmailService.getAuthorizationURL(redirectUri);
  }

  @Get('gmail/token')
  @ApiOperation({
    summary: 'Get Gmail token',
    description: 'Returns Gmail token',
  })
  async gmailToken(
    @Query(new ValidationPipe())
    { code, redirect_uri: redirectUri }: GmailTokenDTO,
  ) {
    return this.gmailService.getToken(code, redirectUri);
  }
  //// ^^ GMAIL ^^ ////
}
