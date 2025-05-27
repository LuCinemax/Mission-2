const calculateDiscountRate = (age, yearsOfExperience) => {

  // VARIABLES FOR DISCOUNT RATE CALCULATION
  const MINIMUM_AGE_FOR_DISCOUNT = 25;
  const MINIMUM_YEARS_OF_EXPERIENCE = 5;
  const MAXIMUM_DISCOUNT = 20;
  const MAXIMUM_AGE = 40;
  const MAXIMUM_YEARS_OF_EXPERIENCE = 10;
  const DISCOUNT_AT_FIVE_PERCENT = 5;
  const NO_DISCOUNT = 0;
  let discountRate = 0; // Start with no discount

  if (age < MINIMUM_AGE_FOR_DISCOUNT && yearsOfExperience > MINIMUM_YEARS_OF_EXPERIENCE) {
    return NO_DISCOUNT; 
  }
  if (age >= MINIMUM_AGE_FOR_DISCOUNT) {
    discountRate += DISCOUNT_AT_FIVE_PERCENT;
  }
  if (yearsOfExperience >= MINIMUM_YEARS_OF_EXPERIENCE) {
    discountRate += DISCOUNT_AT_FIVE_PERCENT;
  }
  if (age >= MAXIMUM_AGE) {
    discountRate += DISCOUNT_AT_FIVE_PERCENT;
  }
  if (yearsOfExperience >= MAXIMUM_YEARS_OF_EXPERIENCE) {
    discountRate += DISCOUNT_AT_FIVE_PERCENT;
  }

  return Math.min(discountRate, MAXIMUM_DISCOUNT);
};

module.exports = { calculateDiscountRate }; // remember to use the brackets you dingo