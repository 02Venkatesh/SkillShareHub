import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSkillSchema, insertConnectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  // Create a new skill
  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating skill:", error);
        res.status(500).json({ message: "Failed to create skill" });
      }
    }
  });

  // Create a connection request
  app.post("/api/connections", async (req, res) => {
    try {
      const validatedData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating connection:", error);
        res.status(500).json({ message: "Failed to create connection" });
      }
    }
  });

  // Get connection status between two skills
  app.get("/api/connections/status", async (req, res) => {
    try {
      const { fromSkillId, toSkillId } = req.query;
      
      if (!fromSkillId || !toSkillId) {
        return res.status(400).json({ message: "fromSkillId and toSkillId are required" });
      }

      const connection = await storage.getConnectionStatus(
        parseInt(fromSkillId as string), 
        parseInt(toSkillId as string)
      );
      
      res.json({ connection });
    } catch (error) {
      console.error("Error fetching connection status:", error);
      res.status(500).json({ message: "Failed to fetch connection status" });
    }
  });

  // Update connection status (accept/reject)
  app.patch("/api/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'" });
      }

      const connection = await storage.updateConnectionStatus(parseInt(id), status);
      res.json(connection);
    } catch (error) {
      console.error("Error updating connection status:", error);
      res.status(500).json({ message: "Failed to update connection status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
