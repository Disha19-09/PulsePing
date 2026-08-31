import express from 'express'
import authroutes from "./routes/auth.routes.js"
import monitorroutes from "./routes/monitor.routes.js"
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authroutes)
app.use("/api/monitors", monitorroutes)

export {app}