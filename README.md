## Live Link: http://mcqapp.iusecookies64.xyz/
# Mcq Battle Platform
* Users get to test their knowledge by participating in short mcq games in topic of their choice and then compete against random players or their friends.
* Users can also create topics of their own, and create questions and challenge their friends to play their game.

## Setup
* Clone the repository and run
  `npm install`
* Then run command `npm run build:packages` to build packages.
* Then run `npm run start` to start all the services.
* Access the client in `http://localhost:5173`.

**Note:** The project requires redis and postgres database either running locally or some somewhere else, add the database connection strings in the .env file.

## The Project
* For the backend I have nodejs.
* For the realtime communications, I have used websockets along with redis pubsub for scalability.
* For primary database I have used Postgres and for storing game state while games are running I have used redis for high performance.
* For frontend I have used React along with Recoil for state management.
* The app uses jsonwebtoken for authentication.
* The project is a mono repo using npm workspaces, the packages contain the common types and input validations using zod.
