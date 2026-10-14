import express from 'express'
import authroutes from "./routes/auth.routes.js"
import monitorroutes from "./routes/monitor.routes.js"
import checkRoutes from "./routes/check.routes.js"
import cookieParser from "cookie-parser"
import cors from 'cors';

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true
}));

app.use("/api/auth", authroutes)
app.use("/api/monitors", monitorroutes)
app.use("/api/checks", checkRoutes)

export {app}