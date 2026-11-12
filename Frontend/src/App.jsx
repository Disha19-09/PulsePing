import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import apiClient from './api/axios'

function App() {
  const [user , setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authError, setAuthError ] = useState(null)

  const checkSession = async () => {
    setCheckingAuth(true)
    setAuthError(null)
    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data.loggedInUser);
    } catch (error) {
        if (!error.response) {
          console.error("CRITICAL: Backend server is completely offline.");
          setAuthError("Cannot connect to the server. Please check your connection and try again.")
        } else if (error.response.status === 401) {
          setUser(null)
          console.log("User is a guest.");
        } else {
          setAuthError("Our server ran into a temporary issue while checking your session.")
          console.error("Server error while checking session. Status:", error.response.status);
        }
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect( () => {
      checkSession()
  }, [])

  if (checkingAuth) {
    return(
      <p>Checking.....</p>
    )
  }

  if(authError) {
    return(
      <div className="error-container">
        <p> { authError } </p>
        <button onClick={checkSession}> Try Again </button>
      </div>
    )
  }
  return (
    <>
      {user ? (
          <div>
            <p>Logged In as, {user.fullName}</p>
            <p>Dashboard layout is currently pending construction. Your secure cookies are actively stored.</p>
          </div>
      ) : (
        <Login handleLoginSuccess = {(userData) => setUser(userData)} />
      )}
    </>
  );
}

export default App
