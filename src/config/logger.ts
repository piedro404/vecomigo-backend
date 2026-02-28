import pino from 'pino';
import { NODE_ENV } from './index.js';

const isProduction = NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isProduction 
    ? {
        formatters: {
          level: (label) => ({ level: label }),
          log: (object) => object
        }
      } 
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            destination: 1,
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard'
          }
        }
      }
  )
});
