import { Checklog } from "../models/checklog.model.js";
import { Monitor } from "../models/monitor.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { checkWithRetry } from "../utils/ping.js";

const runChecks = asyncHandler(async(req, res) => {
    const monitors = await Monitor.find({ tobeMonitored: true })
    const promises = monitors.map(async(monitor) => {
        const result = await checkWithRetry(monitor.url) 
        await saveCheckResult(monitor, result)
    })
    await Promise.allSettled(promises)
    return res.status(200).json({ 
        success: true,
        message: "All checks processed concurrently", 
        count: monitors.length 
    })
})

const saveCheckResult = async (monitor, result) => {
    try {
        monitor.currentStatus = result.status
        monitor.responseTime = result.responseTime
        monitor.statusCode = result.statusCode
        monitor.lastChecked = Date.now()
        await monitor.save()
        const checklog = await Checklog.create({
            monitorId: monitor._id,             
            status: result.status,
            responseTime: result.responseTime,
            statusCode: result.statusCode
        })
        return {monitor, checklog}
    } catch (error) {
        console.error(`Error saving check result for monitor ${monitor}:`, error.message);
        return null;
    }
}
export {runChecks, saveCheckResult}