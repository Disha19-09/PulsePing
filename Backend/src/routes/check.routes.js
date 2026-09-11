import { Router } from "express";
import {runChecks} from "../controllers/check.controller.js"

const router = Router()

router.route("/run").post(runChecks)

export default router