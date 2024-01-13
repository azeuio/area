import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import credentials from './credentials.json';
import { Credentials } from 'google-auth-library';
import { DatabaseService } from '../../firebase/database/database.service';

@Injectable()
export class GmailService {
  readonly apiURL: string = 'https://accounts.google.com/o/oauth2/v2/auth';
  readonly clientID: string = credentials.web.client_id;
  readonly clientSecret: string = credentials.web.client_secret;
  readonly redirectUri: string = credentials.web.redirect_uris[0];
  readonly scopes: string[] = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ];
  readonly accessType: string = 'offline';
  readonly responseType: string = 'code';
  readonly prompt: string = 'consent';
  readonly usersRefId: string = 'users';

  constructor(private readonly db: DatabaseService) {}

  getAuthorizationURL(redirectUri: string) {
    return `${this.apiURL}?client_id=${encodeURIComponent(
      this.clientID,
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${this.scopes
      .map((scope) => encodeURIComponent(scope))
      .join(' ')}&access_type=${encodeURIComponent(
      this.accessType,
    )}&response_type=${encodeURIComponent(
      this.responseType,
    )}&prompt=${encodeURIComponent(this.prompt)}`;
  }

  async getToken(code: string, redirectUri: string): Promise<Credentials> {
    const oauth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
      redirectUri,
    );
    try {
      const { tokens } = await oauth2Client.getToken(code);
      return tokens;
    } catch (e) {
      console.error(e);
    }
  }

  async refreshToken(tokens: Credentials): Promise<Credentials> {
    const oauth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
    );
    oauth2Client.setCredentials(tokens);
    const { token } = await oauth2Client.getAccessToken();
    tokens.access_token = token;
    return tokens;
  }

  async getMessages(token: string, num: number = 10) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
    );
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    // get from INBOX and ignore messages being written
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: num,
      q: 'in:inbox -in:draft',
      labelIds: ['INBOX'],
    });
    return res.data;
  }

  async getMessage(token: string, id: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
    );
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: id,
    });
    return res.data;
  }

  async sendMessage(
    token: string,
    message: string,
    to: string,
    subject: string,
  ) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientID,
      this.clientSecret,
    );
    oauth2Client.setCredentials({ access_token: token });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: this.createRawMessage(message, to, subject),
      },
    });
    return res.data;
  }

  private createRawMessage(message: string, to: string, subject: string) {
    const str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      'Content-Transfer-Encoding: 7bit\n',
      'to: ',
      to,
      '\n',
      'from: ',
      'me',
      '\n',
      'subject: ',
      subject,
      '\n\n',
      message,
    ].join('');

    const encodedMail = Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return encodedMail;
  }
  private decodeEntities(encodedString) {
    const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    const translate = {
      nbsp: ' ',
      amp: '&',
      quot: '"',
      lt: '<',
      gt: '>',
    };
    return encodedString
      .replace(translate_re, function (match, entity) {
        return translate[entity];
      })
      .replace(/&#(\d+);/gi, function (match, numStr) {
        const num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      })
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  htmlToText(html: string) {
    let res = html;
    // only keep body
    if (res.includes('<body')) {
      res = res.match(/<body[^>]*>((.|\n)*?)<\/body>/gs)?.[0] ?? '';
    }
    // remove style and script tags
    res = res.replaceAll(/<style[^>]*>((.|\n)*?)<\/style>/gs, '');
    res = res.replaceAll(/<script[^>]*>((.|\n)*?)<\/script>/gs, '');
    // replace <img> with [image]
    res = res.replaceAll(
      /<img[^>]*?(alt="([^"]*)")[^>]*?>/gs,
      (match, p1, p2) => {
        if (p2) {
          return `[image: ${p2}]`;
        }
        return '[image]';
      },
    );
    // remove all attributes
    res = res.replaceAll(/<[^>]*?>/gms, (match) => {
      return match.replace(/ [^=]+="[^"]*"/g, '');
    });
    // remove comments
    res = res.replaceAll(/<!--((.|\n)*?)-->/gs, '');
    // remove leading and trailing spaces
    res = res.replaceAll(/^\s+/g, '');
    res = res.replaceAll(/\s+$/g, '\n');
    // remove multiple spaces
    res = res.replaceAll(/\s\s+/g, ' ');
    // convert br to new line
    res = res.replaceAll(/<br\s*?>/g, '\n');
    // put new line before block tags
    while (res.match(/<(p|h\d|div|li|ul|ol|tr|td|th|table)>(.*)<\/\1>/gs)) {
      res = res.replace(
        /<(p|h\d|div|li|ul|ol|tr|td|th|table)>(.*)<\/\1>/gs,
        (match, tag, content) => {
          return `\n${content}`;
        },
      );
    }
    // convert blockquote "| content"
    while (res.includes('<blockquote')) {
      res = res.replace(/<blockquote>(.*)<\/blockquote>/gs, (match, p1) => {
        return `| ${p1.replaceAll(/\n/g, '\n| ')}`;
      });
    }
    // remove all other tags
    res = res.replaceAll(/<[^>]*?>/gms, '');
    // remove multiple spaces
    res = this.decodeEntities(res);
    return res;
  }
}
