import { User } from "../../../db/schemas/users";

declare module "fastify" {
  interface FastifyRequest {
    user: User
  }
}