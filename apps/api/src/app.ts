import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import express, { type NextFunction } from "express";
import createError from "http-errors";
import { pinoHttp } from "pino-http";
import db from "./db/knex.js";

export interface AppError extends Error {
  status?: number;
}

export const createApp = () => {
  const app = express();

  app
    .use(pinoHttp())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use((req, res, next) => {
      const allowedOrigin = process.env.CORS_ORIGIN;
      if (allowedOrigin) {
        res.header("Access-Control-Allow-Origin", allowedOrigin);
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS",
        );
        res.header("Access-Control-Allow-Headers", "Content-Type");
      }

      // Handle preflight OPTIONS requests in the middleware
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }

      next();
    })
    // Routes
    .get("/", (_req: Request, res: Response) => {
      res.json({
        message: "Welcome to the TDD workshop!",
      });
    })
    .get("/health", (_req: Request, res: Response) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    })
    .get("/messages", async (req: Request, res: Response) => {
      try {
        const messages = await db("messages")
          .select("id", "content")
          .orderBy("id");
        res.json(messages);
      } catch (error) {
        req.log.error(error);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    })
    .post("/messages", async (req: Request, res: Response) => {
      try {
        const { content } = req.body;

        if (
          !content ||
          typeof content !== "string" ||
          content.trim().length === 0
        ) {
          return res.status(400).json({ error: "Message content is required" });
        }

        // Insert the message into the database
        const [newMessage] = await db("messages")
          .insert({ content: content.trim() })
          .returning(["id", "content"]);

        res.status(201).json({
          message: "Message created successfully",
          data: newMessage,
        });
      } catch (error) {
        req.log.error(error);
        res.status(500).json({ error: "Failed to create message" });
      }
    })
    // Catch 404 and forward to error handler
    .use((_req: Request, _res: Response, next: NextFunction) => {
      next(createError(404));
    })
    // Global error handler (should be after routes)
    .use((err: AppError, req: Request, res: Response) => {
      req.log.error(err);

      // Return JSON error response
      res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        ...(req.app.get("env") === "development" && { stack: err.stack }),
      });
    });

  return app;
};
