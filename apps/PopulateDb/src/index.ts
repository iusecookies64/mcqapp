import csv from "csv-parse";
import { Client } from "pg";
import fs from "node:fs";
import { config } from "dotenv";
import { SignupBody } from "@mcqapp/validations";
import bcrypt from "bcrypt";
import path from "node:path";
config();

const DB_STRING =
  process.env.DB_STRING || "postgres://postgres:123456@localhost:5432/postgres";
const saltRounds = parseInt(process.env.SALT || "10");

console.log(process.env.DB_STRING);
console.log(process.env.SALT);

const client = new Client(process.env.DB_STRING);
client.connect((err) => {
  if (!err) {
    console.log("Connected to db");
  } else {
    clearTimeout(id);
    console.log("Error connection to db");
  }
});

const id = setTimeout(() => {
  createUserTopicAndQuestions();
}, 2000);

async function createUserTopicAndQuestions() {
  try {
    console.log("starting populating");
    // creating user
    const user: SignupBody = {
      first_name: "admin",
      last_name: "admin",
      email: "admin@mcqapp.com",
      username: "admin",
      password: "123456",
      confirm_password: "123456",
    };
    const createUserQuery = `
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;
`;
    const hash = await bcrypt.hash(user.password, saltRounds);
    console.log("hash is", hash);
    const result = await client.query(createUserQuery, [
      user.username,
      user.first_name,
      user.last_name,
      user.email,
      hash,
    ]);

    console.log("user_created", result.rows[0]);

    const user_id: number = result.rows[0].user_id;
    const topics = ["Common Sense"];
    const topic_ids: number[] = [];
    await Promise.all(
      topics.map(async (topic) => {
        const result = await client.query(
          "INSERT INTO topics (title, created_by) VALUES ($1, $2) RETURNING *;",
          [topic, user_id]
        );
        topic_ids.push(result.rows[0].topic_id);
      })
    );
    console.log("creating questions for", topic_ids[0], user_id);
    addQuestions(topic_ids[0], user_id);
  } catch (err) {
    console.log("error populating");
    console.log(err);
  }
}

// reads data from data.csv and converts them to questions in required formats and then pushes these questions to db
async function addQuestions(topic_id: number, user_id: number) {
  fs.readFile(path.join(__dirname, "data.csv"), "utf-8", (err, data) => {
    if (!err) {
      const parser = csv.parse({ delimiter: "," });
      const records: string[] = [];
      parser.on("readable", () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });
      parser.on("error", function (err) {
        console.error(err.message);
      });
      parser.on("end", () => {
        let questions = records.map((record) => {
          const temp = record[2]
            .replaceAll("array(", "")
            .replaceAll("dtype=object)", "")
            .replaceAll("],", "]")
            .replaceAll("'", '"')
            .replaceAll("\n", "");
          try {
            const options = JSON.parse(temp);
            return {
              statement: record[1],
              answer: record[0],
              options,
            };
          } catch (err) {}
        });

        questions = questions.filter(
          (question) => question !== undefined && question?.answer !== "E"
        );
        const query = `
        INSERT INTO questions (created_by, topic_id, statement, answer, option1, option2, option3, option4, difficulty, time_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        questions.slice(0, 200).forEach(async (question) => {
          if (question) {
            const answer = question.answer.charCodeAt(0) - 65 + 1;
            await client.query(query, [
              topic_id,
              user_id,
              question.statement,
              answer,
              question.options.text[0],
              question.options.text[1],
              question.options.text[2],
              question.options.text[3],
              Math.floor(Math.random() * 3) + 1,
              30,
            ]);
          }
        });
      });
      parser.write(data);
      parser.end();
    } else {
      console.log(err);
    }
  });
}
