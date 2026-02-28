import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const TTL_CACHE = parseInt(process.env.TTL_CACHE || '300');
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
