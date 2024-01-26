import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/auth";
import { getUsersCalendarEventsHandler } from "./calendarEvents.controller";
import { $ref } from "./calendarEvents.schema";

export async function calendarEventsRoute(route: FastifyInstance) {
  route.get(
    "/",
    {
      schema: {
        querystring: $ref("calendarEventQuery")
      },
      preHandler: isAuthenticated,
    },
    getUsersCalendarEventsHandler
  );
}