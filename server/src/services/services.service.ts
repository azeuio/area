import { Injectable } from '@nestjs/common';
import { Area, Filters } from '../area/entities/area.entity';
import { Action } from '../firebase/actions/entities/action.entity';
import { DatabaseService } from '../firebase/database/database.service';
import { SpotifyService } from './spotify/spotify.service';
import { BoardsService } from '../boards/boards.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { ActionDelegate, TriggerDelegate } from './entities/delegates';
import {
  AreaCancelled,
  AreaFinished,
  AreaFailed,
  AreaRecursion,
  AreaStopped,
  AreaRestarted,
  AreaInterupt,
} from './interupts/interupt';
import { GmailService } from './gmail/gmail.service';
import { Credentials } from 'google-auth-library';
import { gmail_v1 } from 'googleapis';

type AreaWithId = Area & { id: string };
type ActionWithId = Action & { id: string };

type LogLevel = 'info' | 'warning' | 'error';
const log = (
  origin: string,
  details: string | null,
  logLevel: LogLevel = 'info',
  ...args: any[]
) => {
  const reset = '\x1b[0m';
  const dim = '\x1b[2m';
  const blue = '\x1b[34m';
  const gray = '\x1b[90m';
  const darkGreen = '\x1b[32m';
  const yellow = '\x1b[33m';
  const red = '\x1b[31m';
  const logLevelColor =
    logLevel === 'info'
      ? blue
      : logLevel === 'warning'
        ? yellow
        : logLevel === 'error'
          ? red
          : '';
  console.log(
    `${logLevelColor}${logLevel.toUpperCase()}[${new Date().toLocaleTimeString()}]:${reset} ` +
      `${darkGreen}'${origin}'${dim}${
        details ? gray + '(' + details + ')' : ''
      }${reset}>`,
    ...args,
  );
};

@Injectable()
export class ServicesService {
  public readonly MAX_RESTART_COUNT = 10;
  public readonly UPDATE_INTERVAL = 10.0;
  areas: AreaWithId[] = [];
  areasBeingProcessed: Record<string, Promise<void>> = {};
  actions: Map<string, Action> = new Map();
  private readonly actionsIsTriggeredDelegates: Record<string, TriggerDelegate>;
  private readonly actionDelegates: Record<string, ActionDelegate>;
  private areasProcessingLoop: Promise<void>;

  constructor(
    private readonly database: DatabaseService,
    private readonly boardsService: BoardsService,
    private readonly spotifyService: SpotifyService,
    private readonly gmailService: GmailService,
    private readonly usersService: UsersService,
  ) {
    // timeout to wait for dependencies to load
    this.actionsIsTriggeredDelegates = {
      spotify001: this.triggerSongPlayingTriggered.bind(this),
      general_timer: this.triggerTimer.bind(this),
      gmail_email_received: this.triggerGmailNewEmailTriggered.bind(this),
    };
    this.actionDelegates = {
      spotify002: this.actionSpotifySetPlayerVolume.bind(this),
      log: this.actionLog.bind(this),
      general_addition: this.actionAddition.bind(this),
      general_strcat: this.actionStrcat.bind(this),
      general_join: this.actionJoin.bind(this),
      general_atomize: this.actionAtomize.bind(this),
      gmail_send: this.actionGmailSendEmail.bind(this),
    };
    setTimeout(() => {
      this.database
        .getData<any>(this.database.actionsRefId)
        .then(async (actions: Record<string, Action>) => {
          this.actions = new Map(Object.entries(actions));
          this.areasProcessingLoop = this.processAreas();
        })
        .catch((e) => {
          console.log('Failed to get actions', e);
        });
    }, 0);
  }

  // Tries to trigger every area that has a trigger and a reaction
  async processAreas() {
    this.areas = Object.entries(
      (await this.database.getData<AreaWithId[]>(this.database.areasRefId)) ??
        {},
    ).map(([id, area]: [string, Area]) => ({
      id,
      ...area,
    }));
    /* For each area */
    this.areas
      /* that is not being processed */
      .filter((area) => !this.areasBeingProcessed.hasOwnProperty(area.id))
      /* that has both a trigger and a reaction */
      .filter((area) => this.actions.get(area.action.id))
      .filter((area) => this.actions.get(area.action.id).is_a_trigger)
      .forEach((area) => {
        /* process the area */
        this.areasBeingProcessed[area.id] = this.processArea(area, {
          ...this.actions.get(area.action.id),
          id: area.action.id,
        })
          /* and remove it from the being processed list when done */
          .finally(() => {
            delete this.areasBeingProcessed[area.id];
          });
      });
    setTimeout(() => {
      this.areasProcessingLoop.then(() => {
        this.areasProcessingLoop = this.processAreas();
      });
    }, this.UPDATE_INTERVAL * 1000);
  }

  async processArea(area: AreaWithId, trigger: ActionWithId) {
    let res: any[];
    let shouldRestart = false;
    let restartCount = 0;
    do {
      shouldRestart = false;
      if (restartCount > this.MAX_RESTART_COUNT) {
        throw new AreaFailed(area, trigger, 'Too many restarts');
      }
      try {
        if (restartCount === 0) {
          res = await this.checkIfTriggered(trigger, area);
        }
        if (!area.child_id) {
          throw new AreaFinished(area);
        }
        const firstReaction = {
          ...this.areas.find((a) => a.id === area.child_id),
          id: area.child_id,
        };
        const firstReactionAction = this.actions.get(firstReaction.action.id);
        await this.executeArea(
          trigger,
          { ...firstReactionAction, id: trigger.id },
          firstReaction,
          res,
          restartCount,
        );
      } catch (e) {
        const interupt = e as AreaInterupt;

        switch (e.constructor) {
          case AreaCancelled:
          case AreaFinished:
            break;
          case AreaStopped:
            log('AreaStopped', interupt.reason, 'warning', interupt.message);
            break;
          case AreaFailed:
            log('AreaFailed', interupt.reason, 'warning', interupt.message);
            break;
          case AreaRecursion:
            log('AreaRecursion', interupt.reason, 'warning', interupt.message);
            break;
          case AreaRestarted:
            log('AreaRestarted', interupt.reason, 'warning', interupt.message);
            shouldRestart = true;
            restartCount++;
            break;
          default:
            log('Error', null, e.message);
            throw e;
        }
      }
    } while (shouldRestart);
  }

  private applyFilters(inputs: any[], filters?: Filters): any[] {
    let newInputs = inputs;
    if (!filters) return newInputs;
    switch (filters.type) {
      case 'cherry_pick':
        return filters.inputs.map((i) => inputs[i]);
      default:
        if (filters.reverse) {
          newInputs = newInputs.reverse();
        }
        if (filters.shift) {
          newInputs = [
            ...(filters.shift > 0
              ? Array(filters.shift).fill(filters.shift_replace_value)
              : []),
            ...newInputs,
            ...(filters.shift < 0
              ? Array(filters.shift).fill(filters.shift_replace_value)
              : []),
          ];
          if (filters.shift < 0) {
            newInputs = newInputs.slice(-filters.shift);
          }
        }
        if (filters.range) {
          newInputs = newInputs.slice(
            filters.range.start,
            filters.range.end ?? newInputs.length,
          );
        }
        return newInputs;
    }
  }

  async executeArea(
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    triggerReturn: any[],
    restartCount = 0,
  ) {
    const inputs: any[] = this.applyFilters(triggerReturn, area.action.filters);
    const actionDelegate = this.actionDelegates[area.action.id];
    if (!actionDelegate) {
      throw new AreaFailed(area, trigger, 'No delegate');
    }
    const returnValue = await actionDelegate(
      await this.getConcernedUsers(area),
      trigger,
      self,
      area,
      { restartCount, ...area.action.options },
      ...inputs,
    );
    if (!area.child_id) {
      throw new AreaFinished(area);
    }
    const childArea = this.areas.find((a) => a.id === area.child_id);
    const childAction = this.actions.get(childArea?.action.id);
    if (!childAction) {
      throw new AreaFailed(area, self, 'No child trigger');
    }
    // TODO: check if the output matches the input of the next action (both in type and number)
    await this.executeArea(
      self,
      { ...childAction, id: childArea.action.id },
      childArea,
      returnValue,
      restartCount,
    );
  }

  async checkIfTriggered(self: ActionWithId, area: AreaWithId): Promise<any[]> {
    if (!self.is_a_trigger) {
      throw new AreaFailed(area, self, 'Action is not a trigger');
    }
    const triggerDelegate = this.actionsIsTriggeredDelegates[self.id];
    if (!triggerDelegate) {
      throw new AreaFailed(area, self, 'No trigger delegate');
    }
    const output = await triggerDelegate(
      await this.getConcernedUsers(area),
      self,
      area,
      area.action.options,
    );
    if (!output) {
      throw new AreaFailed(area, self, 'Trigger delegate returned nothing');
    }
    const outputs = this.applyFilters(output, area.action.filters);
    if (!outputs) {
      throw new AreaFailed(area, self, 'Trigger delegate returned nothing');
    }
    return outputs;
  }

  // returns a list because we might want to notify multiple users
  async getConcernedUsers(area: AreaWithId) {
    const board = await this.boardsService.findOne(area.board_id).catch(() => {
      throw new AreaFailed(area, null, 'No board');
    });
    const owner = await this.usersService.findOne(board.owner_id).catch(() => {
      throw new AreaFailed(area, null, 'No owner');
    });
    return [{ ...owner, id: board.owner_id }];
  }

  //// vv Actions logic vv ////
  /// vv General vv ///
  async triggerTimer(
    users: User[],
    self: ActionWithId,
    area: AreaWithId,
    options: any,
  ) {
    const startTime = new Date(options.start_time ?? 0);
    const delay = options.delay ?? 0;
    const now = new Date();
    const timeSinceLastTrigger = now.getTime() - startTime.getTime();

    if (startTime.getTime() === 0) {
      // set the start time to now
      this.database.updateData<Area>(`${this.database.areasRefId}/${area.id}`, {
        action: {
          ...area.action,
          options: {
            ...area.action.options,
            start_time: now.getTime(),
          },
        },
      });
      return [0, now.getTime()];
    }
    if (timeSinceLastTrigger / 1000 >= delay) {
      // set the start time to now
      this.database.updateData<Area>(`${this.database.areasRefId}/${area.id}`, {
        action: {
          ...area.action,
          options: {
            ...area.action.options,
            start_time: now.getTime(),
          },
        },
      });
      return [timeSinceLastTrigger / 1000, now.getTime() / 1000];
    }
    throw new AreaCancelled(area, self, 'Not triggered');
  }

  private actionLog: ActionDelegate = async function (
    users: User[],
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    _options: any,
    ...args: any[]
  ) {
    const logLevel: LogLevel = _options.level ?? 'info';
    log(
      trigger.name,
      area.id,
      logLevel,
      `(${users.map((u) => u.username).join('|')}):`,
      ...args,
    );
    return args;
  };

  private readonly actionAddition: ActionDelegate = async function (
    users: User[],
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    options: any,
    fallthrough: any[],
    ...args: number[]
  ) {
    const value = options.value ?? 0;
    let fallthroughList: any[] = [];

    if (fallthrough instanceof Array) {
      fallthroughList = fallthrough;
    } else if (fallthrough) {
      fallthroughList = [fallthrough];
    }

    return [args.reduce((a, b) => a + b, value), ...fallthroughList];
  };

  private readonly actionStrcat: ActionDelegate = async function (
    users: User[],
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    options: any,
    fallthrough: any[],
    ...args: string[]
  ) {
    const reversed = options.reversed ?? false;
    let fallthroughList: any[] = [];

    if (fallthrough instanceof Array) {
      fallthroughList = fallthrough;
    } else if (fallthrough) {
      fallthroughList = [fallthrough];
    }

    return [
      args.reduce((a, b) => (reversed ? b + a : a + b), ''),
      ...fallthroughList,
    ];
  };

  private readonly actionJoin: ActionDelegate = async function (
    users: User[],
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    options: any,
    fallthrough: any[],
    ...args: any[]
  ) {
    let fallthroughList: any[] = [];

    if (fallthrough instanceof Array) {
      fallthroughList = fallthrough;
    } else if (fallthrough) {
      fallthroughList = [fallthrough];
    }

    return [args, ...fallthroughList];
  };

  private readonly actionAtomize: ActionDelegate = async function (
    users: User[],
    trigger: ActionWithId,
    self: ActionWithId,
    area: AreaWithId,
    options: any,
    fallthrough: any[],
    ...args: any[]
  ) {
    let fallthroughList: any[] = [];

    if (fallthrough instanceof Array) {
      fallthroughList = fallthrough;
    } else if (fallthrough) {
      fallthroughList = [fallthrough];
    }

    return [
      ...args.reduce((a, b) => {
        if (b instanceof Array) {
          return [...a, ...b];
        }
        return [...a, b];
      }),
      ...fallthroughList,
    ];
  };
  /// ^^ General ^^ ///
  /// vv Spotify vv ///

  async getSpotifyToken(owner: User) {
    if (!owner.credentials) {
      return;
    }
    if (!owner.credentials['spotify']?.token) {
      return;
    }
    return owner.credentials['spotify'].token;
  }

  private triggerSongPlayingTriggered: TriggerDelegate = async (
    users,
    self,
    area,
    /* TODO: use options to apply filters on the song type */
    _options?,
  ) => {
    const owner = users[0];
    const token = await this.getSpotifyToken(owner);
    if (!token) {
      throw new AreaCancelled(area, self, 'No spotify token');
    }

    const track = await this.spotifyService.getUserPlaying(token).catch((e) => {
      console.error('Failed to get user playing', e);
    });
    if (!track) {
      throw new AreaCancelled(area, self, 'No track playing');
    }
    return [
      (track.progress_ms / track.item?.duration_ms) * 100 ?? 0,
      track.item?.name ?? '',
      track.item?.artists.map((artist) => artist.name).join(','),
    ];
  };

  private actionSpotifySetPlayerVolume: ActionDelegate = async (
    users,
    trigger,
    self,
    area,
    _options,
    volume: number,
  ) => {
    const owner = users[0];
    const token = await this.getSpotifyToken(owner);
    if (!token) {
      return [0];
    }
    volume = Math.max(0, Math.min(100, volume ?? 100));
    const res = await this.spotifyService.setVolume(token, volume);
    if (typeof res !== 'number') {
      console.error('Failed to set volume', res.error);
      return [0];
    }
    return [res];
  };

  /// ^^ Spotify ^^ ///
  /// vv Gmail vv ///
  async getGmailToken(owner: User): Promise<Credentials> {
    if (!owner.credentials) {
      return;
    }
    if (!owner.credentials['gmail']?.token) {
      return;
    }
    return await this.gmailService.refreshToken(
      owner.credentials['gmail'].token,
    );
  }

  private getAllTextParts(mailParts?: gmail_v1.Schema$MessagePart[]) {
    const textParts: string[] = [];
    mailParts?.forEach((part) => {
      if (part.mimeType.startsWith('multipart/')) {
        let p = part.parts.findIndex((p) => p.mimeType == 'text/html');
        if (p != -1) part = part.parts[p];
        else {
          p = part.parts.findIndex((p) => p.mimeType == 'text/plain');
          if (p != -1) part = part.parts[p];
          else throw new AreaFailed(null, null, 'could not find mail body');
        }
      }
      if (part.mimeType === 'text/html') {
        textParts.push(
          this.gmailService.htmlToText(
            Buffer.from(part.body.data, 'base64').toString(),
          ),
        );
      } else if (part.mimeType === 'text/plain') {
        textParts.push(Buffer.from(part.body.data, 'base64').toString());
      }
    });
    return textParts;
  }

  private triggerGmailNewEmailTriggered: TriggerDelegate = async (
    users,
    self,
    area,
    _options,
  ) => {
    const owner = users[0];
    const token = await this.getGmailToken(owner);
    if (!token) {
      throw new AreaCancelled(area, self, 'No gmail token');
    }
    const messages = await this.gmailService.getMessages(token.access_token);
    const lastMessageId = messages.messages[0].id;
    const lastMessage = await this.gmailService.getMessage(
      token.access_token,
      lastMessageId,
    );
    const date = new Date(parseInt(lastMessage.internalDate));
    const timeSinceReceived = (new Date().getTime() - date.getTime()) / 1000;
    if (timeSinceReceived >= this.UPDATE_INTERVAL * 1.2) {
      throw new AreaCancelled(area, self, 'Not triggered');
    }
    try {
      const body = this.getAllTextParts(lastMessage.payload.parts).join();
      const subject = lastMessage.payload.headers.find(
        (h) => h.name === 'Subject',
      ).value;
      const from = lastMessage.payload.headers.find(
        (h) => h.name === 'From',
      ).value;
      return [body, subject, from];
    } catch (e) {
      throw new e.constructor(area, self, e.reason);
    }
  };

  private actionGmailSendEmail: ActionDelegate = async (
    users,
    trigger,
    self,
    area,
    options,
    body?: string,
    subject?: string,
    to?: string,
  ) => {
    const owner = users[0];
    const token = await this.getGmailToken(owner);
    body = options?.body ?? body;
    subject = options?.subject ?? subject;
    to = options?.to ?? to;
    if (!token) {
      return [body, subject, to];
    }
    const res = await this.gmailService.sendMessage(
      token.access_token,
      body,
      to,
      subject,
    );
    return [body, subject, to, res.id];
  };
  /// ^^ Gmail ^^ ///
  //// ^^ Actions logic ^^ ////
}
