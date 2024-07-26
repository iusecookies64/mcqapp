DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS topics;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
  game_id TEXT PRIMARY KEY,
  player_ids INTEGER[],
  question_ids INTEGER[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
  topic_id SERIAL PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  created_by INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  statement TEXT NOT NULL,
  answer INTEGER NOT NULL,
  option1 TEXT NOT NULL,
  option2 TEXT NOT NULL,
  option3 TEXT NOT NULL,
  option4 TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  time_limit INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (difficulty IN (1, 2, 3)),
  CHECK (answer IN (1, 2, 3, 4)),
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (topic) REFERENCES topics(topic_id)
);

CREATE TABLE responses (
  response_id SERIAL PRIMARY KEY,
  game_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  response INTEGER NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

CREATE TABLE participants (
  user_id INTEGER NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

INSERT INTO users (username, first_name, last_name, email, password) VALUES ('admin', 'admin', 'admin', 'admin@admin.com', '123456');
INSERT INTO topics (title) VALUES ('Common Sense');