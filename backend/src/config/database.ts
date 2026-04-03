import 'dotenv/config';
import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error(
    'Missing DATABASE_URL. Add it to backend/.env, then restart the dev server.'
  );
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[database] connection successful');
    return true;
  } catch (error) {
    console.error('[database] connection failed:', error);
    return false;
  }
};
