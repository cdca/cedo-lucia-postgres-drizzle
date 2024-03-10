import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/database/schema/index.ts",
  out: "./lib/database/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: String(process.env.DB_URL),
  },
  verbose: true,
  strict: true,
} satisfies Config;
