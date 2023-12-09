class ActionDto {
  readonly name: string;
  readonly description: string;
}

class ServiceDto {
  readonly name: string;
  readonly actions: ActionDto[];
  readonly reactions: ActionDto[];
}

export class AboutJsonDto {
  readonly client: {
    host: string;
  };
  readonly server: {
    current_time: number;
    services: ServiceDto[];
  };
}
