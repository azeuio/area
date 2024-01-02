export class AreaTrigger {
  id: string; // action id
  outputs: number[];
  options?: any;
}

export class AreaAction {
  id: string; // action id
  options?: any;
}

export class Area {
  from: AreaTrigger;
  to: AreaAction;
  board_id: string;
  child_id: string;
}
