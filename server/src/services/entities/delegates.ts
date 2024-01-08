import { User } from '../../users/entities/users.entity';
import { Area } from '../../area/entities/area.entity';
import { Action } from '../../firebase/actions/entities/action.entity';

type ActionWithId = Action & { id: string };
type AreaWithId = Area & { id: string };
type ActionOptions = { restartCount: number } & Record<string, any>;

export type TriggerDelegate = (
  users: (User & { id: string })[],
  self: ActionWithId,
  area: AreaWithId,
  options?: Record<string, any>,
) => Promise<any[]>;

export type ActionDelegate = (
  users: (User & { id: string })[],
  trigger: ActionWithId,
  self: ActionWithId,
  area: AreaWithId,
  options: ActionOptions,
  ...args: any[]
) => Promise<any[]>;
