# How to create a service

## 1. Definition

You first need to define your action in the database.
Run the server and go to `localhost:8080/docs` to see the swagger
In there, find the `POST /services` route and define your area

> Please check to see if the service you want doesn't already exist with GET /services

> Note that the color needs to be in the format `0XAARRGGBB`
> where A is alpha, R is red, G is green and B is blue in hexadecimal

## 2. Authentification

Your users will now want to authenticate with your service.

<!-- To allow that to happen, go to `service/src/services/services.controller.ts`

There, you will see other examples of services authentification routes. -->

To start creating your own oauth routes go to the terminal and go into the `server` directory.

Then execute the following command

```bash
nest g service services <name-of-my-service>
```

This will create a new nestjs service for your service (confusing, I know, I didn't choose the names)

Copy the following into the class in your `<name-of-my-service>.service.ts` file

```ts
  /**
   * Returns a url that asks for authaurization from your user
   * ex: https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-user-authorization
   *   (server/src/services/spotify/spotify.service.ts)
   */
  getAuthorizationURL(redirectUri: string) {
  }

  /**
   * Generates a token and returns it
   * ex: https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-an-access-token
   *   (server/src/services/spotify/spotify.service.ts)
   */
  async getToken(code: string, redirectUri: string): Promise<Credentials> {
  }
```

You will now need to fill those functions. Please follow the documentation of your service API to know
the details. You can also check the others service as inspiration

## 3. Create an action

Congrats, you can now [create an action](./create-area.md) for your new service
