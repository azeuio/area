// export class AreaTrigger {
//   id: string; // action id
//   outputs: number[]; // remapping of outputs
//   options?: any;
// }

export class AreaAction {
  id: string; // action id
  outputs: number[]; // remapping of inputs
  options?: any;
}

export class Area {
  action: AreaAction;
  board_id: string;
  child_id?: string;
}
