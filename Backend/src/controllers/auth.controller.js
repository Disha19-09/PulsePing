import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async(req, res) => {
    const {email, password, fullName} = req.body

    if (
        [email, password, fullName].some((field) => field?.trim() === "")
    ){
        return res.status(400).json({message: "All fields are required !!"})
    }

    const existingUser = await User.findOne({email})

    if(existingUser) return res.status(400).json({message: "User already exist !!"})
    
    const user = await User.create({
        email,
        password,
        fullName
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) return res.status(500).json({message: "Something went wrong while registering user !!"})

    return res.status(200).json({message: "User registered Successfully.", createdUser})
})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if([email, password].some((field) => field?.trim() === "")){
        return res.status(400).json({message: "All fields are required !!"})
    }
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message: "Invalid Email or Password !!"})
    
    const isPasswordvalid = await user.isPasswordCorrect(password)

    if(!isPasswordvalid) return res.status(400).json({message: "Invalid Email or Password !!"})
    
    const accessToken = await user.generateAccessTokens()
    const refreshToken = await user.generateRefreshTokens()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({message: "User logged In Successfully", loggedInUser})
})

const logoutUser = asyncHandler(async (req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({message: "User logged out Successfully !!"})
})

export {registerUser, loginUser, logoutUser}