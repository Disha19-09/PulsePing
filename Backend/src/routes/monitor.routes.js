import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createMonitor, deleteMonitor, getMonitors} from "../controllers/monitor.controller.js";


const router = Router()

router.route("/").post(verifyJwt , createMonitor)
router.route("/").get(verifyJwt, getMonitors)
router.route("/:id").delete(verifyJwt, deleteMonitor)

export default router