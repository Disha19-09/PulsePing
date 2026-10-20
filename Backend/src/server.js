import "dotenv/config"
import connectDB from './database/db.js';
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

process.on("unhandledRejection", (reason, promise) => {
  console.error("CRITICAL UNHANDLED REJECTION AT:", promise, "REASON:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("CRITICAL UNCAUGHT EXCEPTION THROWN:", error.message);
  console.error(error.stack);
  process.exit(1); 
});

connectDB()

app.get('/', (req, res) => {
    res.send('PulsePing Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
