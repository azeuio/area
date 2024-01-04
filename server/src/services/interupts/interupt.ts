import { Area } from '../../area/entities/area.entity';
import { Action } from '../../firebase/actions/entities/action.entity';

function areaActingOnActionString(
  act: string,
  area?: Area & { id: string },
  action?: Action & { id: string },
) {
  return (
    `Area ${area?.id} ${act}` +
    (action ? ` action ${action.name}(${action.id})` : '')
  );
}

export class AreaInterupt extends Error {
  public reason?: string = 'Unknown';
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
    public area?: Area & { id: string },
    public action?: Action & { id: string },
    public reason?: string,
  ) {
    super(areaActingOnActionString('stopped', area, action));
  }
}

/**
 * AreaFinished interupt
 *
 * Raised when an area has no more actions to run
 */
export class AreaFinished extends AreaInterupt {
  constructor(public area?: Area & { id: string }) {
    super(areaActingOnActionString('finished', area));
  }
}

/**
 * AreaFailed interupt
 *
 * Raised when an action fails to run
 */
export class AreaFailed extends AreaInterupt {
  constructor(
    public area?: Area & { id: string },
    public action?: Action & { id: string },
    public reason?: string,
  ) {
    super(areaActingOnActionString('failed', area, action));
  }
}

/**
 * AreaCancelled interupt
 *
 * Raised when a trigger cancels the area
 */
export class AreaCancelled extends AreaInterupt {
  constructor(
    public area?: Area & { id: string },
    public action?: Action & { id: string },
    public reason?: string,
  ) {
    super(areaActingOnActionString('cancelled', area, action));
  }
}

/**
 * AreaRestarted interupt
 *
 * Raised when an action restarts the area
 */
export class AreaRestarted extends AreaInterupt {
  constructor(
    public area?: Area & { id: string },
    public action?: Action & { id: string },
    public reason?: string,
  ) {
    super(areaActingOnActionString('restarted', area, action));
  }
}

/**
 * AreaRecursion interupt
 *
 * Raised when an area is triggered by itself
 */
export class AreaRecursion extends AreaInterupt {
  constructor(public area?: Area & { id: string }) {
    super(areaActingOnActionString('recursion', area));
  }
}
