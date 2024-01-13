export type WithId<T> = T & { id: string };

export interface ServiceDto {
  logo?: string;
  name: string;
  description: string;
  color: string;
}

type TypesStr = 'string' | 'number' | 'boolean';
type Types = string | number | boolean;

export interface AreaOption {
  type: TypesStr;
  default?: Types;
}

export interface ActionInputType {
  name: string;
  description: string;
  type: string;
  optional: boolean;
}

export interface ActionDto {
  id: string;
  name: string;
  description: string;
  service_id: string;
  is_a_trigger: boolean;
  inputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  outputs_types?: ActionInputType[]; // i.e. ['string', 'number']
  options?: Record<string, AreaOption>; // i.e. { 'songId': 'value1', 'artistId': 'value2' }
}
interface AreaAction {
  id: string; // action id
  outputs?: never; // deprecated
  options?: any;
  filters?: never; // deprecated
}
export interface AreaDto {
  action: AreaAction;
  board_id: string;
  child_id?: string;
}

export interface CreateAreaDto {
  readonly action: AreaAction;
  readonly board_id: string;
  readonly parent_id?: string;
  readonly child_id?: string;
}

export interface BoardDto {
  id: string;
  name: string;
  description: string;
  color: string;
}
