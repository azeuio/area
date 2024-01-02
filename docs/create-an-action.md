# Create an action

## Summary:

- [Disclaimers](#disclaimers)
- [How to create an action](#how-to-create-an-action)
  1. [Create a service](#step-1)
  2. [step 2](#step-2)
  3. [step 3](#step-3)
- [How to create a trigger](#how-to-create-a-trigger)

## Disclaimers:

> The representation of actions in the database can always change, to be up to date with it, look at the [definition](../server/src/firebase/actions/entities/action.entity.ts)

## How to create an action

### 1. Create a service (optional, you can use an existing one)

Create a [nestjs service](https://docs.nestjs.com/providers#services) using the nest cli

```bash
nest g service myActionServices
```

then populate it with methods that interacts with the api you want to add an action for

### 2. Create the action in firebase

Look at [action.entity.ts](../server/src/firebase/actions/entities/action.entity.ts) and add your action in the firebase database (either through the firebase UI or through the swagger)

### 3. Create the method called when action is triggered

Go to [services.service.ts](../server/src/services/services.service.ts) and start by adding your service in the constructor

```ts
constructor(
    private readonly database: DatabaseService,
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
    private readonly spotifyService: SpotifyService,
    private readonly myActionService: MyActionService
  ) {}
```

You can now create a method that handle your action. Your method definition must look something like this:

```ts
async myAction(trigger: Action, area: Area): any[] {};
```

If your action need to take some parameters, put them after the `area` parameter like so:

```ts
async myAction(trigger: Action, area: Area, firstCustomParam: string, secondOne: number): any[] {};
```

> ⚠️ Do not forget to return the outputs of your action in the same order as they are written in the database

Now that you have written your action, you need to place it in the `actionDelegates` object (you can find it at the top of the class) with the firebase id as key and your method, binded to `this`, as value
i.e.

```ts
 private readonly actionDelegates = {
  spotify002: this.setPlayerVolume.bind(this),
};
```

> ⚠️ While coding, you must take into account that your method will be called every 10s per person subscribed to it. So do not hesitate to add a cache or skip some calls to your api if you can

### Interactions with the front

If at any point, you need to access the front, create the endpoint to communicate with it in [services.controller.ts](../server/src/services/services.controller.ts) as `<name-of-the-service>/<my-endpoint>`

## How to create a trigger

Triggers are identical to actions with a few exceptions:

1. They take no parameters
2. They are stored in `actionsIsTriggeredDelegates` instead of `actionDelegates`
