import { useEffect, useState } from "react";
import AddMonitorForm from "./AddMonitorForm.jsx";
import apiClient from "../api/axios.js";

export default function Dashboard( {handleSessionExpired}) {
  const [monitors, setMonitors] = useState([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [monitorsError, setMonitorsError] = useState(null);

  const handleMonitorAdded = (newMonitor) => {
    setMonitors((prev) => [...prev, newMonitor]);
  };

  const fetchMonitors = async () => {
    setLoadingMonitors(true);
    setMonitorsError(null);

    try {
      const response = await apiClient.get("/monitors");
      setMonitors(response.data.monitors);
    } catch (err) {
      console.error("Failed to fetch monitors:", err);

      if (err.response?.status === 401) {
        handleSessionExpired();
        return;
      }

      setMonitorsError("Could not load your monitors. Please try again.");
    } finally {
      setLoadingMonitors(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  if (loadingMonitors) {
    return <p>Loading monitors...</p>;
  }

  if (monitorsError) {
    return (
      <div>
        <p>{monitorsError}</p>
        <button type="button" onClick={fetchMonitors}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Monitors</h1>
      <AddMonitorForm onMonitorAdded={handleMonitorAdded} />

      {monitors.length === 0 ? (
        <p>No monitors yet.</p>
      ) : (
        <ul>
          {monitors.map((monitor) => (
            <li key={monitor._id}>{monitor.name}</li>
          ))}
        </ul>
      )}
    </div>
  );

}
