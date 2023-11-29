import Fastify from "fastify";
import { drizzle } from "drizzle-orm/mysql2";
import mysql, { Connection } from "mysql2";
import sessionRoute from "./api/modules/session/session.route";
import usersRoute from "./api/modules/users/users.route";
import { sessionSchemas } from "./api/modules/session/session.schema";
import { usersSchemas } from "./api/modules/users/users.schema";
import { uptime } from "./utils/uptime";
import assert from "node:assert";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

function initializeDatabase(): Connection {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: process.env.USERNAME ?? "root",
      database: process.env.DATABASE ?? "fixu"
    });
    return connection;
  } catch (err) {
    console.error("Failed to establish connection with database. Reason:", err);
    process.exit(1);
  }
}

export const db = drizzle(initializeDatabase());

const server = Fastify({
  logger: true,
});

let startedAt: Date;

server.get("/healthcheck", () => {
  const now = new Date();
  assert(startedAt !== undefined, "ERROR: startedAt is undefined");
  return {
    msg: "I am alive.",
    uptime: uptime(startedAt, now)
  };
});

server.decorateRequest("user", null);

for (const schema of [...sessionSchemas, ...usersSchemas]) {
  server.addSchema(schema);
}

server.register(usersRoute, { prefix: "api/users" });
server.register(sessionRoute, { prefix: "api/session" });

server.listen({ port: 8080 }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server started succesfully");
  startedAt = new Date();
});