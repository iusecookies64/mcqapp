import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DB_STRING,
});

client.connect((err) => {
  if (err) {
    console.log("error connecting to db postgres");
  } else {
    console.log("Connected to db successfully");
  }
});

export default client;
