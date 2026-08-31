import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createMonitor } from "../controllers/monitor.controller.js";


const router = Router()

router.route("/").post(verifyJwt , createMonitor)

export default router