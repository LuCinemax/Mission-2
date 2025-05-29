import React, { useState } from "react";
import axios from "axios";

function AgeExperienceForm() {
  // USESTATE VARIABLES
  const [age, setAge] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [discountRate, setDiscountRate] = useState(null);

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDiscountRate(null);

    const parsedAge = parseInt(age, 10);
    const parsedExperience = parseInt(yearsOfExperience, 10); 

    try {
      const response = await axios.post(
        "http://localhost:3000/api/calculateDiscount",
        {
          age: parsedAge,
          yearsOfExperience: parsedExperience,
        }
      );

      // SUCCESSFUL RESPONSE:
      const calculatedDiscount = response.data.discount;
      setDiscountRate(calculatedDiscount); 

      // ALERT MESSAGE
      alert(`The calculated Discount Rate is: ${calculatedDiscount}%`);

    } catch (error) {

      // ERROR HANDLING
      if (error.response) {
        console.error("Error from backend:", error.response.data);
        const errorMessage =
          error.response.data.error || "Something went wrong on the server.";
        alert(`Error calculating discount: ${errorMessage}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(
          "Error: No response from the server. Please check if the backend is running."
        );
      } else {
        console.error("Axios request setup error:", error.message);
        alert("Error: Could not send request. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Discount Rate Calculation</h3>

      <label htmlFor="age">AGE:</label>
      <input
        type="number"
        id="age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Enter your age here..."
        // required
      />

      <label htmlFor="yearsOfExperience">YEARS OF EXPERIENCE:</label>
      <input
        type="number"
        id="yearsOfExperience"
        value={yearsOfExperience}
        onChange={(e) => setYearsOfExperience(e.target.value)}
        placeholder="Enter years of experience..."
        // required
      />

      {discountRate !== null && (
        <div>
          <label htmlFor="discount">DISCOUNT RATE:</label>
          <input
            type="text"
            id="discount"
            value={`${discountRate}%`}
            readOnly
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calculate Discount
      </button>
    </form>
  );
}

export default AgeExperienceForm;
