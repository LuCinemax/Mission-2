// Constants for input validation 
const MIN_RISK_FACTOR  = 1
const MAX_RISK_FACTOR = 5;

// Calculates insurance premiums based on car value and risk rating. 
// Returns either an error object or an object with monthly and yearly premiums.

function calculatePremium(car_value, risk_rating) {
  // Check for missing inputs
  if (car_value === undefined || risk_rating === undefined) {
    return { error: "Missing input: car_value and risk_rating are required." };
  }

  // Enforce strict type checks to avoid strings or other types
  if (typeof car_value !== "number" || typeof risk_rating !== "number") {
    return {
      error: "Invalid input types: car_value and risk_rating must be numbers.",
    };
  }

  // ========Validate input values======== //

  // Check if car_value is a valid number
  if (isNaN(car_value) ||
  // Check if risk_rating is a valid number
      isNaN(risk_rating) ||
  // Ensure car_value is positive
      car_value <= 0 ||
  // Ensure risk_rating is a whole number
      !Number.isInteger(risk_rating) ||
  // Check minimum risk factor boundary
      risk_rating < MIN_RISK_FACTOR ||
  // Check maximum risk factor boundary
      risk_rating > MAX_RISK_FACTOR) {
    return {
      error: `Invalid input: car_value must be > 0 and risk_rating must be an integer between ${MIN_RISK_FACTOR} and ${MAX_RISK_FACTOR}.`,
    };
  }

  // Calculate yearly premium
  const yearly = +(car_value * risk_rating * 0.01).toFixed(4);

  // Calculate monthly premium
  const monthly = +(yearly / 12).toFixed(2);

  // Return premium values
  return {
    monthly_premium: `${monthly}`,
    yearly_premium: `${yearly}`,
  };
}

module.exports = calculatePremium;
