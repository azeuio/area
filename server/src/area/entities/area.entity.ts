interface Filter {
  reverse?: boolean; // invert inputs
  shift?: number; // shift inputs by this amount
  shift_replace_value?: any; // value to replace shifted inputs (if shift_wrap is false) (default: undefined)
  range?: {
    start: number; // start of range
    end?: number; // end of range
  };
}

interface DefaultFilter extends Filter {
  type: 'default';
}
interface FilterCherryPick {
  type: 'cherry_pick';
  inputs: number[]; // inputs to keep
}

export type Filters = DefaultFilter | FilterCherryPick;

export class AreaAction {
  id: string; // action id
  outputs: number[]; //  remapping of inputs
  options?: any;
  filters?: Filters;
}

export class Area {
  action: AreaAction;
  board_id: string;
  child_id?: string;
}
