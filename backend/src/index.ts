import app from './app';
import { config } from 'dotenv';

// Load environment variables
config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});