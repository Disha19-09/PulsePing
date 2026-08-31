import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createMonitor, getMonitors} from "../controllers/monitor.controller.js";


const router = Router()

router.route("/").post(verifyJwt , createMonitor)
router.route("/").get(verifyJwt, getMonitors)

export default router