import axios from 'axios'

const rootURL = import.meta.env.VITE_API_URL

const isProduction = import.meta.env.PROD

if (isProduction && !rootURL) {
  throw new Error(
    "CRITICAL FRONTEND CONFIGURATION ERROR: 'VITE_API_URL' environment variable is missing on Vercel! Deployed production builds cannot fall back to localhost."
  );
}

const activeURL = rootURL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${activeURL}/api`, 
  withCredentials: true,
});
export default apiClient