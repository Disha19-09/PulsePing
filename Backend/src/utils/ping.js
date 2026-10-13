import axios from "axios"
import { User } from "../models/user.model.js"
import nodemailer from "nodemailer"
const validateStatus = (statusCode) => {
    return statusCode<500
}

const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

const wait = (ms) => new Promise ((resolve) => setTimeout(resolve, ms))

const pingUrl = async(url) => {
    const startTime = Date.now();
    try {
        const response = await axios.get(url,{
            timeout: 10000,
            validateStatus
        })
        const responseTime = Date.now() - startTime
        return {status: "up", statusCode: response.status, responseTime}
    } catch (error) {
        const responseTime = Date.now() - startTime
        return { status: "down", statusCode: null, responseTime }
    }
}

const checkWithRetry = async(url)=> {
    const firstpingResult = await pingUrl(url)

    if(firstpingResult.status === "up") return firstpingResult

    await wait(5000)
    
    const retryPing = await pingUrl(url)

    return retryPing
}

const sendAlertEmail = async (monitor, type) => {
    try {
        const userEmail = await User.findById(monitor.user).select('email')
        if(!userEmail || !userEmail.email) throw new Error(`No email address found for monitor: ${monitor._id}`);
        
        let subject = '';
        let textBody = '';

        if (type === 'down'){
            subject = `🚨 ALERT: Monitor "${monitor.name}" is DOWN`;
            textBody = `Your monitor "${monitor.name}" (${monitor.url}) went down at ${new Date().toISOString()}.`;
        }
        else if(type === 'up'){
            subject = `✅ RESOLVED: Monitor "${monitor.name}" is UP`;
            textBody = `Your monitor "${monitor.name}" (${monitor.url}) has recovered and is now UP.`;
        }
        const transporter = getTransporter();
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: userEmail.email,
            subject,
            text: textBody
        });

        console.log(`[Email Success] Sent "${type}" alert email for monitor: "${monitor.name}"`);
        return info;

    } catch (error) {
        console.error(`Failed to send alert email for monitor ${monitor?._id}:`, error);
        throw error;    
    }
}
export {pingUrl , checkWithRetry, sendAlertEmail}