import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  canTeach: text("can_teach").notNull(),
  wantsToLearn: text("wants_to_learn").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  fromSkillId: integer("from_skill_id").notNull().references(() => skills.id),
  toSkillId: integer("to_skill_id").notNull().references(() => skills.id),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Skill = typeof skills.$inferSelect;
export type Connection = typeof connections.$inferSelect;
