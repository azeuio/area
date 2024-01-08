# How to create an action

## 1. Definition

You first need to define your action in the database.
Run the server and go to `localhost:8080/docs` to see the swagger
In there, find the `POST /actions` route and define your area

> NOTE<br>
> There are 2 types of actions: `triggers` and `actions`.
>
> > `Triggers` are the first actions in areas, they have no side effect.
>
> > An `actions` is called if it is linked to a `trigger` that completed successfully.
> > `Actions` also take inputs while `triggers` do not.

## 2. In the code

Go to `service/src/services/services.service.ts`

### Creating a trigger

#### 1. Making the method

> ⚠️ In this step, only edit code in between or in your own files
>
> ```ts
> //// vv Actions logic vv ////
> //// vv {service name} vv ////
>
> /*   your code here   */
>
> //// ^^ {service name} ^^ ////
> //// ^^ Actions logic ^^ ////
> ```
>
> Create a `trigger{nameOfTheAction}` anonymous method, typed with `TriggerDelegate`.
> ex:

```ts
private triggerMyTrigger: TriggerDelegate = async (
    users,            // users concerned by the action
    trigger,          // action that triggered this
    self,             // the action currently being run
    area,             // the area `self` belongs to
    options,          // Additional options of the action
) => {}
```

> If you need complex functions that only your trigger needs, you can create a [service](https://docs.nestjs.com/providers#services) at `services/{serviceName}`

#### 2. Linking it with the existing logic

Go into the constructor and add your method to `actionsIsTriggeredDelegates` like this

```ts
this.actionsIsTriggeredDelegates = {
  ...
  {my_trigger_id}: this.{triggerMyTrigger}.bind(this),
};
```

### Creating an action

#### 1. Making the method

> ⚠️ In this step, only edit code in between or in your own files
>
> ```ts
> //// vv Actions logic vv ////
> //// vv {service name} vv ////
>
> /*   your code here   */
>
> //// ^^ {service name} ^^ ////
> //// ^^ Actions logic ^^ ////
> ```
>
> Create a `action{nameOfTheAction}` anonymous method, typed with `ActionDelegate`.
> ex:

```ts
private actionMyAction: ActionDelegate = async (
    users,            // users concerned by the action
    trigger,          // action that triggered this
    self,             // the action currently being run
    area,             // the area `self` belongs to
    options,          // Additional options of the action
    // from this point on, you can add as many params
    // as you want, just make sure the types/numbers
    // are the same as in the database
    body?: string,
    subject?: string,
    to?: string,
) => {}
```

> If you need complex functions that only your trigger needs, you can create a [service](https://docs.nestjs.com/providers#services) at `services/{serviceName}`

#### 2. Linking it with the existing logic

Go into the constructor and add your method to `actionDelegates` like this

```ts
this.actionDelegates = {
  ...
  {my_trigger_id}: this.{triggerMyTrigger}.bind(this),
};
```
