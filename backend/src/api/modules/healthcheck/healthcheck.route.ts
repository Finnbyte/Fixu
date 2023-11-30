import { FastifyInstance } from "fastify";
import { GET } from "./healthcheck.controller";

export default async function healthcheckRoute(route: FastifyInstance) {
  route.get("/", GET);
}