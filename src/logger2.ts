import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new LokiTransport({
      host: 'http://loki:3100',
      json: true,
      labels: { job: 'node-app' },
      replaceTimestamp: true,
      format: format.json(),
      interval: 5 // send logs every 5 seconds
    })
  ],
});

export default logger;
