import { Request, Response, NextFunction } from 'express';
import logger from '../logger2';

export function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationInMilliseconds = (seconds * 1000) + (nanoseconds / 1e6);
    
    logger.info('Request logged', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${durationInMilliseconds.toFixed(2)} ms`,
      ip: req.ip
    });
  });

  next();
}