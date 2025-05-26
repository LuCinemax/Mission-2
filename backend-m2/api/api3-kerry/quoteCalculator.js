function calculatePremium(car_value, risk_rating) {
  car_value = Number(car_value);
  risk_rating = Number(risk_rating);

  if (
    isNaN(car_value) ||
    isNaN(risk_rating) ||
    risk_rating < 1 ||
    risk_rating > 5
  ) {
    return { error: "there is an error" };
  }

  const yearly = (car_value * risk_rating) / 100;
  const monthly = yearly / 12;

  return {
    monthly_premium: parseFloat(monthly.toFixed(2)),
    yearly_premium: parseFloat(yearly.toFixed(2)),
  };
}

module.exports = calculatePremium;
