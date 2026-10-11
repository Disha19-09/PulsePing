import { Checklog } from "../models/checklog.model.js";
import { Monitor } from "../models/monitor.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { checkWithRetry, sendAlertEmail } from "../utils/ping.js";

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
        console.log(`[Check] "${monitor.name}" | Status: ${result.status} | Failures: ${monitor.consecutiveFailures} -> Incoming Alert State: ${monitor.isAlerted}`);
        
        if (result.status === 'down') {
            monitor.consecutiveFailures += 1;
        } else if (result.status === 'up') {
            monitor.consecutiveFailures = 0;
        }

        if (monitor.consecutiveFailures >= 3 && monitor.isAlerted === false) {
            try {
                await sendAlertEmail(monitor, "down");
                monitor.isAlerted = true;
            } catch (emailError) {
                console.error(
                    `[Alert Failure] Failed to send "down" email for monitor ID: ${monitor._id} (${monitor.name || 'Unnamed'}). ` +
                    `Reason: ${emailError.message}. Code: ${emailError.code || 'N/A'}. ` +
                    `Status remains isAlerted=false and will retry next check.`, 
                    emailError
                );
            }
        }

        if (monitor.isAlerted === true && result.status === "up") {
            try {
                await sendAlertEmail(monitor, "up");
                monitor.isAlerted = false;
            } catch (emailError) {
                // FIXED: Message now correctly specifies "up" email and status remains true
                console.error(
                    `[Alert Failure] Failed to send "up" email for monitor ID: ${monitor._id} (${monitor.name || 'Unnamed'}). ` +
                    `Reason: ${emailError.message}. Code: ${emailError.code || 'N/A'}. ` +
                    `Status remains isAlerted=true and will retry next check.`, 
                    emailError
                );
            }
        }        
        
        monitor.currentStatus = result.status;
        monitor.responseTime = result.responseTime;
        monitor.statusCode = result.statusCode;
        monitor.lastChecked = Date.now();
        await monitor.save();
        
        const checklog = await Checklog.create({
            monitorId: monitor._id,             
            status: result.status,
            responseTime: result.responseTime,
            statusCode: result.statusCode
        });
        
        return { monitor, checklog };
    } catch (error) {
        console.error(`Error saving check result for monitor ${monitor}:`, error.message);
        return null;
    }
};
export {runChecks, saveCheckResult}