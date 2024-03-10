import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  userName: varchar("user_name", { length: 256 }),
  email: varchar("email", { length: 256 }),
  githubId: varchar("github_id", { length: 256 }),
  hashedPassword: varchar("hashed_password", { length: 256 }),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const insertUserSchema = createInsertSchema(user);
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
