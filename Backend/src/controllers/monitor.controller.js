import isURL from "validator/lib/isURL.js"
import { Monitor } from "../models/monitor.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createMonitor = asyncHandler(async (req, res) => {
    try {
        const {url, name} = req.body
        const userId = req.user._id

        if ([url,name].some((field)=> field?.trim() === "")){
        return res.status(400).json({message: "URL / Name are required!!"})
        }

        if(!isURL(url)) return res.status(400).json({message: "Please enter a valid URL!!"})

        const existingmonitor = await Monitor.findOne({user: userId, url: url});
        if(existingmonitor) {
            return res.status(400).json({message: "Monitor already exist!!"})
        }

        const newMonitor = await Monitor.create({
            user: userId,
            url,
            name
        })

        return res.status(201).json({message: "Monitor created Successfully!!", newMonitor})
    } catch (error) {
        
        if(error.code === 11000){
            return res.status(400).json({message: "Monitor already being created!!"})
        }

        return res.status(500).json({message: error.message})
    }
})

export { createMonitor}