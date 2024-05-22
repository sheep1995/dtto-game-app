import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: 'https://ebde28967ab345bb89509e6aabe894a7.us-central1.gcp.cloud.es.io:443',
  auth: {
    apiKey: 'R0JkaWxZOEJvR2VSNFJmbEUwbTA6aFVWNnluTUhUMXVnTWZId3pSeFVTUQ==',
  },
});

const logger = createLogger({
  level: 'info', // 设置默认日志级别
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // 捕获错误堆栈信息
    format.json()
  ),
  defaultMeta: {
    service: 'user-service',
    environment: process.env.NODE_ENV || 'development',
    application: 'your-application-name',
    version: '1.0.0',
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message} [CONTEXT] -> ${info.context ? JSON.stringify(info.context, null, 2) : '{}'}`)
      )
    }),
    new ElasticsearchTransport({
      level: 'info', // 设置传输到 Elasticsearch 的日志级别
      client: esClient,
      indexPrefix: 'logs',
      transformer: (logData: any) => {
        return {
          '@timestamp': new Date().toISOString(),
          severity: logData.level,
          message: logData.message,
          fields: logData.meta,
        };
      },
    }),
    new DailyRotateFile({
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message} [CONTEXT] -> ${info.context ? JSON.stringify(info.context, null, 2) : '{}'}`),
        format.json()
      ),
    })
  ]
});

// 导出 logger 以便在其他文件中使用
export default logger;