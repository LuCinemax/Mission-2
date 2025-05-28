import React, { useState } from "react";
import styles from './QuoteCalculatorApp.module.css'

function QuoteCalculatorApp({ carValue, riskRating }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setQuote(null);
    setError(null);

    const parsedCarValue = parseFloat(carValue);
    const parsedRiskRating = parseInt(riskRating, 10);

    if (isNaN(parsedCarValue) || isNaN(parsedRiskRating)) {
      setError("Both car value and risk rating must be valid numbers.");
      return;
    }

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_value: parsedCarValue,
          risk_rating: parsedRiskRating,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unknown error");

      setQuote(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.api3}>
      <h3>API 3 — Quote Calculation</h3>

      <button
        onClick={handleCalculate}

      >
        Calculate Quote
      </button>

      {error && <p>{error}</p>}

      {quote && (
        <div>
          <p>
            Monthly Premium: <span>${quote.monthly_premium}</span>
          </p>
          <p>
            Yearly Premium: <span>${quote.yearly_premium}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default QuoteCalculatorApp;


