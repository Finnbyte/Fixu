import type { Config } from "drizzle-kit";
 
export default {
  schema: "./db/schemas/*",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    uri: "mysql://root@localhost:3306/fixu"
  }
} satisfies Config;