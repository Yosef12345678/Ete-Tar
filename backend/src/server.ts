import 'dotenv/config';
import express from 'express';
import { sequelize } from './config/database';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/', publicRoutes);
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('[database] connection successful');

    await sequelize.sync();
    console.log('[database] models synchronized');

    app.listen(PORT, () => {
      console.log(`ETE-TAR running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('[startup] failed to initialize server:', error);
    process.exit(1);
  }
};

void startServer();
