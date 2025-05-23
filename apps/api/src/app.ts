import cookieParser from 'cookie-parser';
import type { Request, Response } from 'express';
import express, { type NextFunction } from 'express';
import createError from 'http-errors';
import { pinoHttp } from 'pino-http';

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
    // Routes
    .get('/', (_req: Request, res: Response) => {
      res.json({
        message: 'Welcome to the TDD workshop!',
      });
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
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

  return app;
};
