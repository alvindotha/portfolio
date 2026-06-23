import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  adminUsername: process.env.ADMIN_USERNAME || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
