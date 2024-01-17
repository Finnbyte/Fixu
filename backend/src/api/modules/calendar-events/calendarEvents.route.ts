import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/auth";
import { getUsersCalendarEventsHandler } from "./calendarEvents.controller";

export async function calendarEventsRoute(route: FastifyInstance) {
  route.get(
    "/",
    {
      preHandler: isAuthenticated,
    },
    getUsersCalendarEventsHandler
  );
}