import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string, defaultValue?: string) {
  const value = process.env[name] ?? defaultValue;

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  }

  return value;
}

export const PORT = parseInt(requiredEnv("PORT", "3000"));
export const NODE_ENV = requiredEnv("NODE_ENV", "development");
export const CORS_ORIGIN = requiredEnv("CORS_ORIGIN", "*");
export const TTL_CACHE = parseInt(requiredEnv("TTL_CACHE", "300"));
export const LOG_LEVEL = requiredEnv("LOG_LEVEL", "info");

export const IS_PRODUCTION = NODE_ENV === "production";