import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

if (
  !process.env.DB_HOST ||
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD
) {
  throw new Error("Database credentials missing.");
}

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  logger: true,
});
