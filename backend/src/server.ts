import Fastify from "fastify";
import sessionRoute from "./api/modules/session/session.route";
import { sessionSchemas } from "./api/modules/session/session.schema";
import usersRoute from "./api/modules/users/users.route";
import { usersSchemas } from "./api/modules/users/users.schema";
import { customErrorHandler } from "./api/errorHandler";
import coursesRoute from "./api/modules/courses/courses.route";
import { coursesSchemas } from "./api/modules/courses/courses.schema";
import fastifyCookie from "@fastify/cookie";
import healthcheckRoute from "./api/modules/healthcheck/healthcheck.route";
import { calendarEventsRoute } from "./api/modules/calendar-events/calendarEvents.route";
import { calendarEventsSchemas } from "./api/modules/calendar-events/calendarEvents.schema";

export function serverBuilder() {
  const server = Fastify({
    logger: true,
  });

  server.register(fastifyCookie, {
    secret: "fixu", // for cookies signature
    hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}, // options for parsing cookies
  });

  server.setErrorHandler(customErrorHandler);

  server.decorateRequest("user", null);

  for (const schema of [...sessionSchemas, ...usersSchemas, ...coursesSchemas, ...calendarEventsSchemas]) {
    server.addSchema(schema);
  }

  server.register(healthcheckRoute, { prefix: "healthcheck" });
  server.register(usersRoute, { prefix: "api/users" });
  server.register(sessionRoute, { prefix: "api/session" });
  server.register(coursesRoute, { prefix: "api/courses" });
  server.register(calendarEventsRoute, { prefix: "api/calendar-events" });

  return server;
}
