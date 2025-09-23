import dotenv from 'dotenv';
import { app } from './app';
import { PORT } from './server-constants';
import { validateEnv } from './helpers/env.helper';

dotenv.config();

const env = validateEnv();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Home: http://localhost:${PORT}/`);
  console.log(`🔗 API v1: http://localhost:${PORT}/api/v1/`);
});
