import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from "zod"
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return ["user1", "user2"];
  }),
  fails: publicProcedure.query(async () => {
    throw new TRPCError({
        code: "BAD_REQUEST"
    })
  })
});

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3000);
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;