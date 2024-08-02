## Mcq Battle Platform
* Users get to test their knowledge by participating in short mcq games in topic of their choice and then compete against random players or their friends.
* Users can also create topics of their own, and create questions and challenge their friends to play their game.

## Setup
* Clone the repository and run
  `npm install`
* Then run command `npm run build:packages` to build packages.
* Then run `npm run dev` to start all the services.

**Note:**The project required there you to have redis and postgres database either running locally or some somewhere else, add the database connection strings in the environment files inside the api and websocket apps.
