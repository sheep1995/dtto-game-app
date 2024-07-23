import * as winston from 'winston';
import { LokiTransportOptions } from 'winston-loki';

declare module 'winston/lib/winston/transports' {
  interface Transports {
    Loki: typeof LokiTransport;
  }
}