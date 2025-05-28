import React, { useState } from "react";
import styles from "./CarValueApp.module.css";

function CarValueApp({ onCarValueChange }) {
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState(null);
  const [carValue, setCarValue] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCarValue(null);

    const parsedYear = parseInt(year, 10);
    if (!model || isNaN(parsedYear) || parsedYear <= 0) {
      setError("Invalid model or year");
      return;
    }

    try {
      const res = await fetch("/api/car-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, year: parsedYear }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setCarValue(data.carValue);
      if (typeof onCarValueChange === "function") {
        onCarValueChange(data.carValue);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.api1}>
      <h2>Car Quote Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Model:
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
            />
          </label>
        </div>

        <div>
          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <p>{error}</p>}

      {carValue !== null && (
        <p>
          Estimated Car Value: $<span id="carValueNumber">{carValue}</span>
        </p>
      )}
    </div>
  );
}

export default CarValueApp;
