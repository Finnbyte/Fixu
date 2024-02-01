import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/auth";
import { createCalendarEventHandler, deleteCalendarEventHandler, getUsersCalendarEventsHandler, updateCalendarEventHandler } from "./calendarEvents.controller";
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

  route.post(
    "/",
    {
      schema: {
        body: $ref("createCalendarEventBodySchema")
      },
      preHandler: isAuthenticated
    },
    createCalendarEventHandler
  )

  route.put(
    "/",
    {
      schema: {
        body: $ref("createCalendarEventBodySchema")
      },
      preHandler: isAuthenticated
    },
    updateCalendarEventHandler
  )

  route.delete(
    "/:calendarEventId",
    {
      schema: {
        params: $ref("calendarEventParams")
      },
      preHandler: isAuthenticated
    },
    deleteCalendarEventHandler 
  )
}