import express from 'express';
import { PORT } from './config/index.js'; 
import { setupServer } from './config/server.js';
import { logger } from '@config/logger.js';
import { ErrorCodes, HTTP_STATUS } from './utils/constants.js';

import appRouter from './routes/app.route.js';
import { failure } from './utils/response.js';

const app: express.Application = express();

setupServer(app);

app.use(appRouter);

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json(failure('Endpoint not found', ErrorCodes.NOT_FOUND));
});

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

startServer();