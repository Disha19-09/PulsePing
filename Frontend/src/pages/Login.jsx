import React, { useState } from "react";
import apiClient from "../api/axios.js";

function Login() {
    const [formdata , setformdata ] = useState({email:"" , password:""})
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const handleChange = (e) => {
        setformdata(prev => ({...prev, [e.target.name] : e.target.value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            const response = await apiClient.post("/auth/login", formdata)
            setUserProfile(response.data.loggedInUser);
        } catch (error) {
            const backendError = error.response?.data?.message || "An Unexpected error has occured"
            setErrorMsg(backendError);
        }finally{
            setLoading(false);
        }
    }

    if (userProfile) {
        return (
            <div>
                <p>Logged In as, {userProfile.fullName}</p>
                <p>Dashboard layout is currently pending construction. Your secure cookies are actively stored.</p>
            </div>
        )
    }
    return (
        <>
        <div>
            <h1>Account Login</h1>
            {errorMsg && (
                <div>
                    ❌ {errorMsg}
                </div>
            )}        
            <div>
                <form onSubmit = {handleSubmit} >
                    <div>
                        <label htmlFor="email">Enter Email</label>
                        <input type="email"
                        name="email" 
                        id="email"
                        value={formdata.email}
                        onChange={handleChange}
                        required
                         />
                    </div>
                    <div>
                        <label htmlFor="password">Enter your Password</label>
                        <input type="password"
                        name="password" 
                        id="password"
                        value={formdata.password}
                        onChange={handleChange}
                        required
                         />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging In....." : "Login"}
                    </button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login;