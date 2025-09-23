import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Home: http://localhost:${PORT}/`);
  console.log(`🔗 API v1: http://localhost:${PORT}/api/v1/`);
});
