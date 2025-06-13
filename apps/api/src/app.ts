import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import express, { Router, type NextFunction } from "express";
import createError from "http-errors";
import { pinoHttp } from "pino-http";
import { MessageController } from "./controllers/message.controller.js";
import type { MessageRepository } from "./controllers/message.repository.js";

export interface AppError extends Error {
  status?: number;
}

export const createApp = (messageRepository: MessageRepository) => {
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
    });

  const messageController = new MessageController(messageRepository);
  const messageRouter = Router();
  messageRouter.get("/", messageController.getMessages.bind(messageController));
  messageRouter.post(
    "/",
    messageController.createMessage.bind(messageController),
  );
  app
    .use("/messages", messageRouter)
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
