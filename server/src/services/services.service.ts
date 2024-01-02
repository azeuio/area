import { Injectable } from '@nestjs/common';
import { Area } from '../area/entities/area.entity';
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

  constructor(
    private readonly database: DatabaseService,
    private readonly boardsService: BoardsService,
    private readonly spotifyService: SpotifyService,
    private readonly usersService: UsersService,
  ) {
    // timeout to wait for dependencies to load
    this.actionsIsTriggeredDelegates = {
      spotify001: this.triggerSongPlayingTriggered.bind(this),
    };
    this.actionDelegates = {
      spotify002: this.actionSpotifySetPlayerVolume.bind(this),
      log: this.actionLog.bind(this),
    };
    setTimeout(() => {
      this.database
        .getData<any>(this.database.actionsRefId)
        .then((actions: Record<string, Action>) => {
          this.actions = new Map(Object.entries(actions));
          // call processServices every 5 seconds
          setInterval(() => {
            this.processAreas();
          }, this.UPDATE_INTERVAL * 1000);
        })
        .catch((e) => {
          console.log('Failed to get actions', e);
        });
    }, 0);
  }

  // Tries to trigger every area that has a trigger and a reaction
  async processAreas() {
    this.areas = Object.entries(
      await this.database.getData<AreaWithId[]>(this.database.areasRefId),
    ).map(([id, area]: [string, Area]) => ({
      id,
      ...area,
    }));
    /* For each area */
    this.areas
      /* that is not being processed */
      .filter((area) => !this.areasBeingProcessed.hasOwnProperty(area.id))
      /* that has both a trigger and a reaction */
      .filter((area) => this.actions.has(area.from.id))
      .filter((area) => this.actions.get(area.from.id).is_a_trigger)
      .filter((area) => this.actions.has(area.to.id))
      .forEach((area) => {
        /* process the area */
        this.areasBeingProcessed[area.id] = this.processArea(area, {
          ...this.actions.get(area.from.id),
          id: area.from.id,
        })
          /* and remove it from the being processed list when done */
          .finally(() => {
            delete this.areasBeingProcessed[area.id];
          });
      });
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
        await this.executeArea(trigger, area, res, restartCount);
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

  async executeArea(
    trigger: ActionWithId,
    area: AreaWithId,
    triggerReturn: any[],
    restartCount = 0,
  ) {
    const actionDelegate = this.actionDelegates[area.to.id];
    if (!actionDelegate) {
      throw new AreaFailed(area, trigger, 'No delegate');
    }
    const reaction = { ...this.actions.get(area.to.id), id: area.to.id };
    const returnValue = await actionDelegate(
      await this.getConcernedUsers(area),
      trigger,
      reaction,
      area,
      { restartCount, ...area.to.options },
      ...triggerReturn,
    );
    if (!area.child_id) {
      throw new AreaFinished(area);
    }
    const childArea = this.areas.find((a) => a.id === area.child_id);
    const childTrigger = this.actions.get(childArea?.from.id);
    if (!childTrigger) {
      throw new AreaFailed(area, reaction, 'No child trigger');
    }
    // TODO: check if the output matches the input of the next action (both in type and number)

    const childTriggerWithId = { ...childTrigger, id: childArea.from.id };
    await this.executeArea(
      childTriggerWithId,
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
      area.from.options,
    );
    if (!output) {
      throw new AreaFailed(area, self, 'Trigger delegate returned nothing');
    }
    const reorganizedOutput: any[] = [];
    try {
      for (const i in area.from.outputs) {
        reorganizedOutput.push(output[i]);
      }
    } catch (e) {
      throw new AreaFailed(
        area,
        self,
        'Trigger delegate returned invalid data',
      );
    }
    return reorganizedOutput;
  }

  // returns a list because we might want to notify multiple users
  async getConcernedUsers(area: Area) {
    const board = await this.boardsService.findOne(area.board_id);
    const owner = await this.usersService.findOne(board.owner_id);
    return [owner];
  }

  //// vv Actions logic vv ////
  /// vv General vv ///
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
  //// ^^ Actions logic ^^ ////
}
