

import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); // Clear previous errors

    if (!input.trim()) {
      setError("Please enter some text before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.response);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch response. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Hey This is an GEN AI APP for Giving JD </h2>

        {/* Input Field */}
        <label htmlFor="input-text">Enter the details :</label>
        <textarea
          id="input-text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="hey🙂 enter the details here buddy..."
          style={{ textAlign: "left" }}
        />

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Output Field (Fixed Size + Scrollable) */}
        <label htmlFor="output-text">Generated JD:</label>
        <div className="output-box" id="output-text">
          {loading ? (
            <span className="loading-text">Generating...</span>
          ) : output ? (
            output
          ) : (
            <span className="text-placeholder">Output will appear here...</span>
          )}
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default App;
