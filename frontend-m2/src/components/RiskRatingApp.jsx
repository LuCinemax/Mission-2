import React, { useState } from "react";
import styles from './RiskRatingApp.module.css';

function RiskRatingApp({ onRiskRatingChange }) {
  const [claimHistory, setClaimHistory] = useState('');
  const [riskRating, setRiskRating] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRiskRating(null);
    setError(null);

    try {
      const response = await fetch("/api/risk-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_history: claimHistory }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unknown error");

      setRiskRating(data.risk_rating);
      if (typeof onRiskRatingChange === 'function') {
        onRiskRatingChange(data.risk_rating);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.api2}>
      <h2>Claim History → Risk Rating</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Claim History:
          <textarea
            value={claimHistory}
            onChange={(e) => setClaimHistory(e.target.value)}
            placeholder="Describe past 3 years of claims..."
            required
          />
        </label>

        <button type="submit">
          Get Risk Rating
        </button>
      </form>

      {error && <p>{error}</p>}

      {riskRating !== null && (
        <p>
          Risk Rating: <span id="riskRatingValue">{riskRating}</span>
        </p>
      )}
    </div>
  );
}

export default RiskRatingApp;
