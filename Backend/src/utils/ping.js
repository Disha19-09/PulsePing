import axios from "axios"

const validateStatus = (statusCode) => {
    return statusCode<500
}

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
export {pingUrl , checkWithRetry}