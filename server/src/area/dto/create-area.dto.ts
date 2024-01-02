import { AreaAction, AreaTrigger } from '../entities/area.entity';

export class CreateAreaDto {
  readonly from: AreaTrigger;
  readonly to: AreaAction;
  readonly board_id: string;
  readonly parent?: string;
  readonly child?: string;
}
