import { useEffect, useState } from "react";
import apiClient from "../api/axios.js";

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [loadingMonitors, setLoadingMonitors] = useState(true);
  const [monitorsError, setMonitorsError] = useState(null);

  const fetchMonitors = async () => {
    setLoadingMonitors(true);
    setMonitorsError(null);

    try {
      const response = await apiClient.get("/monitors");
      setMonitors(response.data.monitors);
    } catch (err) {
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

  if (monitors.length === 0) {
    return <p>No monitors yet.</p>;
  }

  return (
    <ul>
      {monitors.map((monitor) => (
        <li key={monitor._id}>{monitor.name}</li>
      ))}
    </ul>
  );
}
