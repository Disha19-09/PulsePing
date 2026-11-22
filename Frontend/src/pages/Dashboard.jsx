import { useEffect, useState } from "react";
import AddMonitorForm from "./AddMonitorForm.jsx";
import apiClient from "../api/axios.js";

export default function Dashboard( {handleSessionExpired}) {
  const [monitors, setMonitors] = useState([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [monitorsError, setMonitorsError] = useState(null);

  
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleMonitorAdded = (newMonitor) => {
    setDeleteError("")
    setMonitors((prev) => [...prev, newMonitor]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this monitor?")) {
      return;
    }
    setDeleteError("");
    setDeletingId(id);
    try {
      await apiClient.delete(`/monitors/${id}`);
      setMonitors((prev) => prev.filter((monitor) => monitor._id !== id));
    } catch (error) {
      const status = error.response?.status
      if (status === 401) {
        handleSessionExpired();
        return;
      }
      if (!status || status >= 500) {
        setDeleteError("Unable to delete the monitor right now. Please try again later.");
      }
      else {
        setDeleteError(error.response?.data?.message || "Failed to delete monitor. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
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
      
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

      {monitors.length === 0 ? (
        <p>No monitors yet.</p>
      ) : (
        <ul>
          {monitors.map((monitor) => (
            <li key={monitor._id}>
              <span>{monitor.name} - {monitor.url}</span>
              <button
                type="button"
                onClick={() => handleDelete(monitor._id)}
                disabled={deletingId === monitor._id}
              >
                {deletingId === monitor._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>

      )}
    </div>
  );

}
