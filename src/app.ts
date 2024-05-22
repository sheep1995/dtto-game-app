import express, { Application, Request, Response, NextFunction } from 'express';
import { router as v1 } from './routes/v1/index';
import logger from './logger';
import authMiddleware from './middlewares/auth';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(authMiddleware);

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const logData = {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
        headers: req.headers,
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
        userInfo: req.user
      };
      logger.info(`Request: ${req.method} ${req.url}`, logData);
      next();
    });
  }

  private routes(): void {
    this.app.use('/api', v1);
  }
}

export default new App().app;
