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
    .use((_req, res, next) => {
      const allowedOrigin = process.env.CORS_ORIGIN;
      if (allowedOrigin) {
        res.header("Access-Control-Allow-Origin", allowedOrigin);
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS",
        );
        res.header("Access-Control-Allow-Headers", "Content-Type");
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
    // Catch 404 and forward to error handler
    .use((_req: Request, _res: Response, next: NextFunction) => {
      next(createError(404));
    })
    // Global error handler (should be after routes)
    .use((err: AppError, req: Request, res: Response) => {
      req.log.error(err);

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

  return app;
};
