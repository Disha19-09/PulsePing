import {Router} from "express"
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/me").get(verifyJwt, getCurrentUser)

export default router
