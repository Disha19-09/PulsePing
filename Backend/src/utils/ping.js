import axios from "axios"

const validateStatus = (statusCode) => {
    return statusCode<500
}
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
export {pingUrl}