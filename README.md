# Insurance Quote Web App

## Overview

This web application provides users with an interactive interface to calculate car insurance quotes using four backend APIs.

---

## Features

- **API 1 – Car Value Calculation**  
  Calculates the estimated car value from the provided model and year using a custom logic based on character positions.

- **API 2 – Risk Rating Analysis**  
  Accepts a description of a user’s past claim history and assigns a risk rating from 1 to 5.

- **API 3 – Quote Calculation**  
  Computes both yearly and monthly premiums using the car value API 1 and risk rating API 2. Includes validation for numeric and integer inputs.

- **API 4 – Discount Rate**  
  Applies a discount to the quote based on the user's age and driving experience.

---

## Installation and Usage

```bash
# 1. Clone the Repository
git clone https://github.com/YourUsername/Mission-2.git
cd Mission-2

# 2. Install Dependencies
cd backend-m2
npm install

cd ../frontend-m2
npm install

# 3. Start the Application
# In one terminal:
cd backend-m2
npm run dev

# In a second terminal:
cd frontend-m2
npm run dev
```

---

## How to Use

1. Enter car model and year to calculate estimated value.  
2. Describe past claim history to determine a risk rating.  
3. Combine car value and risk rating to calculate premiums.  
4. Optionally enter age and experience to receive a discount on the quote.

---

## Testing

```bash
cd backend-m2

# Runs all
npm test 

# Runs individual tests
npm run test:api1
npm run test:api2
npm run test:api3
npm run test:api4
```

### Test Coverage Includes:

- **Valid Test Cases** – Proper inputs for normal behavior.  
- **Boundary Test Cases** – Lowest and highest accepted values.  
- **Edge Cases** – e.g., car value just above zero (0.01).  
- **Invalid Input Cases** – Strings, malformed types, or empty values.  
- **Null Cases** – Either or both fields set to null.
