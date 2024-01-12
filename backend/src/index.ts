import { drizzle } from "drizzle-orm/mysql2";
import mysql, { Connection } from "mysql2";
import schemas from "../db/schemas";
import { serverBuilder } from "./server";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

function databaseConnectionBuilder(): Connection {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: process.env.DATABASE_USER ?? "root",
      database: process.env.DATABASE ?? "fixu"
    });
    return connection;
  } catch (err) {
    console.error("Failed to establish connection with database. Reason:", err);
    process.exit(1);
  }
}

export const SALT = 10;

export const db = drizzle(databaseConnectionBuilder(), { schema: schemas, mode: "default" });


const server = serverBuilder();
const serverPort = Number(process.env.PORT) || 3000;

server.listen({ port: serverPort }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server started succesfully at ${address}`);
});