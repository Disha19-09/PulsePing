import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


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
        return res.status(401).json({message: "Invalid access token"})
    }
})

export {verifyJwt}