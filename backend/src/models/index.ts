import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://postgres:123456@localhost:5432/postgres",
});

client.connect();

export default client;

// queries to create different tables
const temp = `

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contests (
  contest_id SERIAL PRIMARY KEY,
  created_by INTEGER NOT NULL,
  title VARCHAR(20) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FORIEGN KEY created_by REFERENCES users(user_id) DELETE ON CASCADE
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  title VARCHAR(300) NOT NULL,
  answer VARCHAR(50) NOT NULL,
  difficulty INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FORIEGN KEY contest_id REFERENCES contests(contest_id) DELETE ON CASCADE,
  CHECK (difficulty IN (1, 2, 3))
);

CREATE TABLE options (
  option_id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  title VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FORIEGN KEY question_id REFERENCES questions(question_id) DELETE ON CASCADE
);

CREATE TABLE participants(
  contest_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  PRIMARY KEY (contest_id, user_id),
  FORIEGN KEY contest_id REFERENCES contests(contest_id) DELETE ON CASCADE,
  FORIEGN KEY user_id REFERENCES users(user_id) DELETE ON CASCADE
);

CREATE TABLE responses (
  response_id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  response VARCHAR(50) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMEZONE
  FORIEGN KEY question_id REFERENCES questions(question_id) DELETE ON CASCADE,
  FORIEGN KEY user_id REFERENCES users(user_id) DELETE ON CASCADE
);

`;
