import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const JWT_ERRORS = new Set([
    "TokenExpiredError",
    "JsonWebTokenError",
    "NotBeforeError"
]);

const verifyJwt = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies.accessToken
        if(!token) return res.status(401).json({message: "Unauthorized request"})
        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedUser._id).select(
            "-password -refreshToken"
        )
        if(!user) return res.status(401).json({message: "Invalid access token"})
        
        req.user = user
        next()

    } catch (error) {
        if (JWT_ERRORS.has(error.name)) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        console.error("verifyJwt unexpected error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

export {verifyJwt}