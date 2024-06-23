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
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contests (
  contest_id SERIAL PRIMARY KEY,
  created_by INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  max_participants INTEGER NOT NULL CHECK (max_participants <= 20),
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  invite_only BOOLEAN NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  title VARCHAR(400) NOT NULL,
  answer VARCHAR(100) NOT NULL,
  difficulty INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE,
  CHECK (difficulty IN (1, 2, 3))
);

CREATE TABLE options (
  option_id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE participants(
  contest_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  PRIMARY KEY (contest_id, user_id),
  FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE responses (
  response_id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  response VARCHAR(100) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE invitations (
  invitation_id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

`;
