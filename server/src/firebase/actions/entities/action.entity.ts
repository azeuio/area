export class ActionInputType {
  name: string;
  description: string;
  type: string;
  optional: boolean;
}

export class Action {
  name: string;
  description: string;
  service_id: string;
  is_a_trigger: boolean;
  inputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  outputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  options?: any; // i.e. { 'songId': 'value1', 'artistId': 'value2' }
}
