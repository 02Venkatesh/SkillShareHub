import { skills, connections, type Skill, type InsertSkill, type Connection, type InsertConnection } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  getConnections(skillId: number): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnectionStatus(id: number, status: string): Promise<Connection>;
  getConnectionStatus(fromSkillId: number, toSkillId: number): Promise<Connection | null>;
}

// Initialize PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set");
  console.error("Please set DATABASE_URL to your PostgreSQL connection string");
  console.error("Example: postgresql://username:password@localhost:5432/database");
  console.error("Current environment variables:", Object.keys(process.env).filter(key => key.includes('DATABASE')));
  throw new Error("DATABASE_URL environment variable is required");
}

console.log("Connecting to database with URL:", connectionString.replace(/:[^:@]*@/, ':****@'));

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client);

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<any | undefined> {
    // Implementation for user management (not used in current app)
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    // Implementation for user management (not used in current app)
    return undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // Implementation for user management (not used in current app)
    return insertUser;
  }

  async getSkills(): Promise<Skill[]> {
    try {
      console.log("Fetching skills from database...");
      const result = await db.select().from(skills).orderBy(skills.createdAt);
      console.log("Fetched skills:", result);
      return result;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    try {
      console.log("Creating skill:", insertSkill);
      const result = await db.insert(skills).values(insertSkill).returning();
      console.log("Created skill:", result[0]);
      return result[0];
    } catch (error) {
      console.error("Error creating skill:", error);
      throw error;
    }
  }

  async getConnections(skillId: number): Promise<Connection[]> {
    try {
      console.log("Fetching connections for skill:", skillId);
      const result = await db.select().from(connections).where(eq(connections.fromSkillId, skillId));
      console.log("Fetched connections:", result);
      return result;
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    try {
      console.log("Creating connection:", connection);
      const result = await db.insert(connections).values(connection).returning();
      console.log("Created connection:", result[0]);
      return result[0];
    } catch (error) {
      console.error("Error creating connection:", error);
      throw error;
    }
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection> {
    try {
      console.log("Updating connection status for ID:", id, "to", status);
      const result = await db.update(connections).set({ status }).where(eq(connections.id, id)).returning();
      console.log("Updated connection:", result[0]);
      return result[0];
    } catch (error) {
      console.error("Error updating connection status:", error);
      throw error;
    }
  }

  async getConnectionStatus(fromSkillId: number, toSkillId: number): Promise<Connection | null> {
    try {
      console.log("Fetching connection status for fromSkillId:", fromSkillId, "toSkillId:", toSkillId);
      const result = await db.select().from(connections).where(and(eq(connections.fromSkillId, fromSkillId), eq(connections.toSkillId, toSkillId)));
      console.log("Fetched connection status:", result);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error fetching connection status:", error);
      throw error;
    }
  }
}

export const storage = new PostgresStorage();
