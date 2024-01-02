import { Area } from '../../area/entities/area.entity';
import { Action } from '../../firebase/actions/entities/action.entity';

export class AreaInterupt extends Error {
  public reason: string;
  constructor(public message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * AreaStopped interupt
 *
 * Raised when an action stops the area from running following actions
 */
export class AreaStopped extends AreaInterupt {
  constructor(
    public area: Area & { id: string },
    public action: Action & { id: string },
    public reason: string,
  ) {
    super(`Area ${area.id} stopped by action ${action.name}(${action.id})`);
  }
}

/**
 * AreaFinished interupt
 *
 * Raised when an area has no more actions to run
 */
export class AreaFinished extends AreaInterupt {
  constructor(public area: Area & { id: string }) {
    super(`Area ${area.id} finished`);
  }
}

/**
 * AreaFailed interupt
 *
 * Raised when an action fails to run
 */
export class AreaFailed extends AreaInterupt {
  constructor(
    public area: Area & { id: string },
    public action: Action & { id: string },
    public reason: string,
  ) {
    super(`Area ${area.id} failed by action ${action.name}(${action.id})`);
    this.reason = reason;
  }
}

/**
 * AreaCancelled interupt
 *
 * Raised when a trigger cancels the area
 */
export class AreaCancelled extends AreaInterupt {
  constructor(
    public area: Area & { id: string },
    public trigger: Action & { id: string },
    public reason: string,
  ) {
    super(
      `Area ${area.id} cancelled by trigger ${trigger.name}(${trigger.id})`,
    );
    this.reason = reason;
  }
}

/**
 * AreaRestarted interupt
 *
 * Raised when an action restarts the area
 */
export class AreaRestarted extends AreaInterupt {
  constructor(
    public area: Area & { id: string },
    public action: Action & { id: string },
    public reason: string,
  ) {
    super(`Area ${area.id} restarted by action ${action.name}(${action.id})`);
  }
}

/**
 * AreaRecursion interupt
 *
 * Raised when an area is triggered by itself
 */
export class AreaRecursion extends AreaInterupt {
  constructor(public area: Area & { id: string }) {
    super(`Area ${area.id} recursion`);
  }
}
