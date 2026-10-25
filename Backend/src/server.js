import "dotenv/config"
import connectDB from './database/db.js';
import { app } from './app.js';
import mongoose from "mongoose";

let server;
const PORT = process.env.PORT || 3000;
let isShuttingDown = false;

process.on("unhandledRejection", (reason, promise) => {
  console.error("CRITICAL UNHANDLED REJECTION AT:", promise, "REASON:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("CRITICAL UNCAUGHT EXCEPTION THROWN:", error.message);
  console.error(error.stack);
  process.exit(1); 
});

const handleShutdown = (signal) => {
    if (isShuttingDown) {
         console.log(`[${new Date().toISOString()}] ⏳ ${signal} ignored. Shutdown already in progress.`);
         return;
     }
    isShuttingDown = true;
    console.log(`[${new Date().toISOString()}] 👋 ${signal} received. Initiating graceful teardown...`);
    
    const safetyTimeout = setTimeout(() => {
        console.error(`[${new Date().toISOString()}] 🚨 Shutdown grace period expired! Forcing hard exit.`);
        process.exit(1);
    }, 26000);

    if (server) {
        server.close(async (err) => {
            if (err) {
                console.error(`[${new Date().toISOString()}] ❌ Error while closing HTTP server:`, err);
                process.exit(1);
            } else {
                console.log(`[${new Date().toISOString()}] 🛑 HTTP server fully drained.`);
            }
            try {
                if (mongoose.connection.readyState !== 0) {
                    await mongoose.connection.close();
                    console.log(`[${new Date().toISOString()}] 🍃 MongoDB connection cleanly disconnected.`);
                }
                clearTimeout(safetyTimeout); 
                process.exit(0);
            } catch (error) {
                console.error(`[${new Date().toISOString()}] ❌ Error during database disconnection:`, error);
                process.exit(1);
            }
        });
    } else {
        clearTimeout(safetyTimeout);
        process.exit(0);
    }
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

connectDB()

app.get('/', (req, res) => {
    res.send('PulsePing Backend is running!');
});

server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
