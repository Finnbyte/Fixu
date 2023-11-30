import Fastify from "fastify";
import sessionRoute from "./api/modules/session/session.route";
import { sessionSchemas } from "./api/modules/session/session.schema";
import usersRoute from "./api/modules/users/users.route";
import { usersSchemas } from "./api/modules/users/users.schema";
import { formatUptime } from "./utils/uptime";
import { customErrorHandler } from "./api/errorHandler";

export function serverBuilder() {
  const server = Fastify({
    logger: false,
  });

  server.get("/healthcheck", () => {
    const uptimeInSeconds = process.uptime();
    return {
      msg: "I am alive.",
      uptime: formatUptime(uptimeInSeconds),
    };
  });

  server.decorateRequest("user", null);

  for (const schema of [...sessionSchemas, ...usersSchemas]) {
    server.addSchema(schema);
  }

  server.register(usersRoute, { prefix: "api/users" });
  server.register(sessionRoute, { prefix: "api/session" });

  server.setErrorHandler(customErrorHandler);

  return server;
}
