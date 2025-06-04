import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import express, { type NextFunction } from "express";
import createError from "http-errors";
import { pinoHttp } from "pino-http";

// Mock data for messages
const messages = [
  { id: 1, content: "Hello, welcome to the TDD Workshop!" },
  { id: 2, content: "This is a test message" },
  { id: 3, content: "Feel free to explore the application" },
  { id: 4, content: "Learning Test-Driven Development is fun!" },
  { id: 5, content: "Remember to write tests first" },
  { id: 6, content: "Red, Green, Refactor - the TDD cycle" },
  { id: 7, content: "Testing helps catch bugs early" },
  { id: 8, content: "Good tests make good documentation" },
  { id: 9, content: "Confidence in your code comes from tests" },
  { id: 10, content: "TDD helps with better design decisions" },
  { id: 11, content: "Automated tests save time in the long run" },
  { id: 12, content: "Test coverage is important but not everything" },
  { id: 13, content: "Unit tests should be fast and isolated" },
  { id: 14, content: "Integration tests verify components work together" },
  { id: 15, content: "End-to-end tests validate the whole system" },
  { id: 16, content: "Mocking helps isolate test subjects" },
  { id: 17, content: "Test doubles can be stubs, spies, or mocks" },
  { id: 18, content: "Behavior-driven development extends TDD" },
  { id: 19, content: "Continuous integration runs tests automatically" },
  { id: 20, content: "Happy testing!" }
];

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
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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
    .get("/messages", (_req: Request, res: Response) => {
      res.json(messages);
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
