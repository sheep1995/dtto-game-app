import express, { Application } from 'express';
import { router as v1 } from './routes/v1/index';

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
  }

  private routes(): void {
    this.app.use('/api', v1);
  }
}

export default new App().app;
