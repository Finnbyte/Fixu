import { FastifyInstance } from "fastify";
import { getUptimeHandler } from "./healthcheck.controller";

export default async function healthcheckRoute(route: FastifyInstance) {
  route.get("/", getUptimeHandler);
}