import { useState } from "react";
import apiClient from "../api/axios.js";

function AddMonitorForm({ onMonitorAdded }) {
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await apiClient.post("/monitors", formData);
      onMonitorAdded(response.data.newMonitor);
      setFormData({ name: "", url: "" });
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMsg(error.response.data?.message || "Invalid input.");
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Website"
          required
        />
      </div>

      <div>
        <label>URL</label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Monitor"}
      </button>
    </form>
  );
}

export default AddMonitorForm;
