import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  logger: true,
});
