import dotenv from 'dotenv';
import { envSchema, type Env } from '../types/env.js';

// Cargar .env.local primero, luego .env
dotenv.config({ path: '.env.local' });
dotenv.config();

export function loadEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Exportar env validado
export const env = loadEnv();
