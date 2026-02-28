import express from 'express';
import { PORT } from './config/index.js'; 
import { setupServer } from './config/server.js';
import { logger } from '@config/logger.js';

const app: express.Application = express();

setupServer(app);

const startServer = async () => {
  try {    
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📚 Documentation available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

startServer();