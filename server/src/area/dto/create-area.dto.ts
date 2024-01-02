import { AreaAction } from '../entities/area.entity';

export class CreateAreaDto {
  readonly action: AreaAction;
  readonly board_id: string;
  readonly parent_id?: string;
  readonly child_id?: string;
}
