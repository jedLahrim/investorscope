import { mysqlTable, varchar, text, timestamp, boolean, double, int, json } from "drizzle-orm/mysql-core";
import * as crypto from "node:crypto";

export const deepSearchTypes = mysqlTable("deep_search_types", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  type_id: varchar("type_id", { length: 36 }).references(() => deepSearchTypes.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  // embedding: customType(...) if using pgvector, omitted for simplicity in v1
});

export const investors = mysqlTable("investors", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  firm_name: varchar("firm_name", { length: 255 }).notNull(),
  contact_name: varchar("contact_name", { length: 255 }),
  role: varchar("role", { length: 255 }),
  stage_focus: json("stage_focus").notNull(), // stored as json array
  check_size_min: int("check_size_min"),
  check_size_max: int("check_size_max"),
  website: varchar("website", { length: 2048 }),
  linkedin_url: varchar("linkedin_url", { length: 2048 }),
  notes: text("notes"),
});

export const investorCategoryScores = mysqlTable("investor_category_scores", {
  investor_id: varchar("investor_id", { length: 36 }).references(() => investors.id).notNull(),
  category_id: varchar("category_id", { length: 36 }).references(() => categories.id).notNull(),
  relevance_score: double("relevance_score").notNull(),
  source_url: varchar("source_url", { length: 2048 }).notNull(),
  source_type: varchar("source_type", { length: 255 }).notNull(), // e.g., 'sec_form_d'
  extracted_at: timestamp("extracted_at").defaultNow().notNull(),
  verified: boolean("verified").default(false).notNull(),
});

export const searchRuns = mysqlTable("search_runs", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  type_id: varchar("type_id", { length: 36 }).references(() => deepSearchTypes.id).notNull(),
  category_id: varchar("category_id", { length: 36 }).references(() => categories.id).notNull(),
  keywords: text("keywords"),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, processing, completed, failed
  started_at: timestamp("started_at"),
  completed_at: timestamp("completed_at"),
});
