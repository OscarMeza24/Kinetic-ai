import cors from 'cors';
import { env } from '../config/env.js';

export const corsConfig = cors({
  origin: [
    env.FRONTEND_URL,
    'http://localhost:8081',
    'http://localhost:19006', // Expo web
    'http://localhost:3000',  // Local dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
});
