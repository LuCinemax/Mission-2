import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";
import logo from "../assets/Images/turnerscars_logo.png";
import styles from "./API.module.css";
import finance from "../assets/Images/finance.jpg";
import userIcon from "../assets/Images/user.png";
import phoneIcon from "../assets/Images/phone.png";
import locationIcon from "../assets/Images/location.png";
import AgeExperienceForm from '../components/AgeExperienceForm';

// ====================================================================
// START OF HELPER COMPONENTS DEFINITIONS
// IMPORTANT: These components (CarValueHistory, CarValueItem, etc.)
// must be defined BEFORE the main 'API' component where they are used.
// ====================================================================

/**
 * CarValueHistory Component: Displays a list of past car value calculations.
 * @param {object} props - The component props.
 * @param {Array<object>} props.history - An array of car value calculation results.
 */
function CarValueHistory({ history }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Car Value Calculation History
      </h2>
      {history.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No calculations yet. Calculate a new value!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item, index) => (
            <CarValueItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * CarValueItem Component: Displays a single car value calculation result.
 * @param {object} props - The component props.
 * @param {object} props.item - A single car value calculation object.
 */
function CarValueItem({ item }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 hover:shadow-md transition duration-200">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={`${item.model || 'Unknown'} car`}
            className="w-24 h-16 object-cover rounded-md shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/100x70/E0E0E0/333333?text=No+Image`; // Fallback placeholder if image fails
            }}
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Model: {item.model}</h3>
          <p className="text-gray-600 text-sm">Year: {item.year}</p>
          {item.carValue ? (
            <p className="text-green-700 font-bold text-md">Value: ${item.carValue.toLocaleString()}</p>
          ) : (
            <p className="text-red-600 font-bold text-md">Error: {item.error || 'N/A'}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Calculated On: {item.timestamp}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * CalculateCarValueForm Component: Provides a form to input car details for calculation.
 * @param {object} props - The component props.
 * @param {function} props.onCalculate - Callback function to trigger car value calculation.
 */
function CalculateCarValueForm({ onCalculate }) {
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState(null); // To display success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    if (!model || !year) {
      setMessage({ type: 'error', text: 'Both Model and Year are required.' });
      return;
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear <= 0) {
      setMessage({ type: 'error', text: 'Year must be a positive number.' });
      return;
    }

    const carInput = { model, year: parsedYear };
    try {
      await onCalculate(carInput);
      setMessage({ type: 'success', text: 'Car value calculated successfully!' });
      setModel(''); // Clear form fields on success
      setYear('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to calculate car value. Please check input and backend.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Calculate New Car Value
      </h2>
      <div className="mb-4">
        <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">
          Car Model:
        </label>
        <input
          type="text"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., Civic, Porsche"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="year" className="block text-gray-700 text-sm font-bold mb-2">
          Year:
        </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g., 2014"
          required
        />
      </div>
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg relative ${
          message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`} role="alert">
          {message.text}
        </div>
      )}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        >
          Calculate Value
        </button>
      </div>
    </form>
  );
}

/**
 * CarValueTester Component: Provides a button to test the backend car value API with batch data.
 * @param {object} props - The component props.
 * @param {string} props.TEST_DATA_API_URL - URL for fetching test data.
 * @param {string} props.CAR_VALUE_API_URL - URL for sending car value calculation requests.
 */
function CarValueTester({ TEST_DATA_API_URL, CAR_VALUE_API_URL }) {
  const [testResult, setTestResult] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testError, setTestError] = useState(null);

  const handleTestCarValue = async () => {
    setLoadingTest(true);
    setTestError(null);
    setTestResult(null);

    // --- DEBUGGING LOGS START ---
    console.log("--- Batch Test Started ---");
    console.log("Fetching test data from:", TEST_DATA_API_URL);
    // --- DEBUGGING LOGS END ---

    try {
        // Fetch the test data from the backend endpoint first
        const testDataResponse = await fetch(TEST_DATA_API_URL);
        if (!testDataResponse.ok) {
            throw new Error(`Failed to fetch test data: HTTP error! status: ${testDataResponse.status}`);
        }
        const testData = await testDataResponse.json();
        // --- DEBUGGING LOGS START ---
        console.log("Test data fetched:", testData);
        // --- DEBUGGING LOGS END ---

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Filter out 'comment' and other non-API fields from the testData
        const rawDataForAPI = testData.map(({ model, year }) => ({ model, year }));
        // --- DEBUGGING LOGS START ---
        console.log("Data prepared for POST request:", rawDataForAPI);
        // --- DEBUGGING LOGS END ---


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(rawDataForAPI),
            redirect: "follow"
        };

        // --- DEBUGGING LOGS START ---
        console.log("Sending POST request to:", CAR_VALUE_API_URL);
        // --- DEBUGGING LOGS END ---

        // Now send the filtered test data to the car value calculation API
        const response = await fetch(CAR_VALUE_API_URL, requestOptions);
        const result = await response.json();
        // --- DEBUGGING LOGS START ---
        console.log("POST request response received:", result);
        // --- DEBUGGING LOGS END ---

        if (!response.ok) {
            setTestError(`API returned status: ${response.status}`);
        }
        setTestResult(result);
    } catch (error) {
        // --- DEBUGGING LOGS START ---
        console.error("Caught error in handleTestCarValue:", error); // Clarified error message
        // --- DEBUGGING LOGS END ---
        setTestError("Failed to connect to Car Value API or fetch test data. Please ensure the backend is running.");
    } finally {
        setLoadingTest(false);
        // --- DEBUGGING LOGS START ---
        console.log("--- Batch Test Finished ---");
        // --- DEBUGGING LOGS END ---
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Car Value API Batch Test
      </h2>
      <p className="text-gray-600 mb-4 text-center">
        This section sends a predefined batch of car data (including valid and invalid cases)
        to your backend's `/api/car-value` endpoint to demonstrate its batch processing and error handling.
        The test data itself is fetched from the backend's `/api/test-car-batch-mixed` endpoint.
      </p>
      <div className="flex justify-center mb-6">
        <button
          onClick={handleTestCarValue}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition duration-200"
          disabled={loadingTest}
        >
          {loadingTest ? 'Running Test...' : 'Run Car Value Batch Test'}
        </button>
      </div>

      {testError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
          <strong className="font-bold">Test Error:</strong>
          <span className="block sm:inline ml-2">{testError}</span>
        </div>
      )}

      {testResult && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Test Result (JSON Response):</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
            <code>{JSON.stringify(testResult, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// END OF HELPER COMPONENTS DEFINITIONS
// ====================================================================


// ====================================================================
// MAIN API COMPONENT DEFINITION
// ====================================================================
const API = () => {
  //Kerry-----------------------------------------------------------------------------------------------
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        car_value: 6614,
        risk_rating: 5,
      }),
    })
      .then((res) => res.json())
      .then((data) => setQuote(data))
      .catch((err) => setQuote({ error: "Failed to fetch" }));
  }, []);
  
  //Takashi------------------------------------------------------------------------------------------
  // START OF API 1 (Takashi Section) Logic and State
  // This section contains state variables and functions crucial for the Car Value Evaluation Application.
  // Ensure this code is NOT commented out by accident.

  // State to store the history of car value calculations performed by the user
  const [carValueHistory, setCarValueHistory] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading status for individual calculations
  const [error, setError] = useState(null); // State to store any error messages
  // State to control current view: 'history', 'calculate', or 'carValueTest'
  const [view, setView] = useState('history');

  // State to store 'known cars' data, now fetched from backend
  const [knownCars, setKnownCars] = useState([]);

  // Backend API URL for car value calculation
  const CAR_VALUE_API_URL = 'http://localhost:3000/api/car-value';
  // Backend endpoint for fetching mixed test data (used for knownCars array and batch test)
  const TEST_DATA_API_URL = 'http://localhost:3000/api/test-car-batch-mixed';

  // useEffect hook to fetch knownCars data from the backend when the component mounts
  useEffect(() => {
    const fetchKnownCars = async () => {
      try {
        const response = await fetch(TEST_DATA_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Add a placeholder image_url if not present in the fetched data
        const carsWithImages = data.map(car => ({
            ...car,
            image_url: car.image_url || `https://placehold.co/100x70/E0E0E0/333333?text=${car.model || 'Car'}`
        }));
        setKnownCars(carsWithImages);
      } catch (error) {
        console.error("Failed to fetch known cars data:", error);
        // Fallback to empty array or a default hardcoded list if fetch fails
        setKnownCars([]);
      }
    };

    fetchKnownCars();
  }, []); // Empty dependency array means this runs once on mount

  // Function to calculate car value by sending data to the backend API
  const calculateCarValue = async (carInput) => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors

    try {
      const response = await fetch(CAR_VALUE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carInput), // Send car model and year as JSON
      });

      const result = await response.json(); // Parse response as JSON

      if (!response.ok) {
        // If response is not OK (e.g., 400 Bad Request), it's an error
        const errorMessage = result.error || "An unknown error occurred.";
        const errorCode = result.errorCode || "UNKNOWN_ERROR";
        throw new Error(`${errorMessage} (Code: ${errorCode})`);
      }

      // Find the corresponding image URL from the knownCars list
      const matchedCar = knownCars.find(car =>
        car.model && carInput.model && car.model.toLowerCase() === carInput.model.toLowerCase() &&
        car.year === carInput.year
      );
      // Use the matched image URL or a generic placeholder if no match is found
      const imageUrl = matchedCar ? matchedCar.image_url : `https://placehold.co/100x70/E0E0E0/333333?text=No+Image`;


      // Add the successful calculation to history, including the image URL
      setCarValueHistory(prevHistory => [
        { ...carInput, carValue: result.carValue, timestamp: new Date().toLocaleString(), image_url: imageUrl },
        ...prevHistory // Add new calculation to the top of the list
      ]);
      setView('history'); // Switch back to history view after calculation

    } catch (err) {
      console.error("Failed to calculate car value:", err);
      setError(`Calculation failed: ${err.message}`); // Set error message
    } finally {
      setLoading(false); // Set loading to false after calculation attempt
    }
  };
  // END OF API 1 (Takashi Section) Logic and State

  return (
    <div>

      {/* ========######## HEADER ########======== */}
      <TopHeader></TopHeader>

    {/* ========######## TOP LOGO SECTION ########======== */}
      <div className={styles.logoBox}>
        <figure className={styles.logoImage}>
          {/* Turners Logo */}
          <img src={logo} alt="turnerslogo" />
        </figure>
        <ul className={styles.infoSection}>
          <li>
            <img src={userIcon} alt="" />
            <a href="https://www.turners.co.nz/Login/?ReturnUrl=/Cars/finance-insurance/car-insurance/">
              LOGIN
            </a>{" "}
            OR{" "}
            <a href="https://www.turners.co.nz/Login/Registration/">REGISTER</a>
          </li>
          <li>
            {" "}
            <img src={phoneIcon} alt="" /> 0800 887 637
          </li>
          <li>
            <img src={locationIcon} alt="" />
            <a href="https://www.turners.co.nz/Company/Branches/">Find Us</a>
          </li>
          <li>
            <a href="https://www.turners.co.nz/Company/Branches/">中文</a>
          </li>
        </ul>
      </div>

      {/* ========######## NAVIGATION BAR ########======== */}
      <NavBar></NavBar>

      {/* ========######## BREADCRUMB NAVIGATOR ########======== */}
      <main className={styles.background}>
        <section className={styles.pageBox}>
          <nav className={styles.breadcrumb}>
            <a href="https://www.turners.co.nz/">Home</a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/">Cars</a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/finance-insurance/">
              Finance & Insurance
            </a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/finance-insurance/car-insurance/">
              Car Insurance
            </a>
            <span>»</span>
            <a href="#">API</a>
          </nav>

          {/* ========######## HEAD BANNER ########======== */}
          <figure>
            <img className={styles.financeImg} src={finance} alt="" />
          </figure>

          {/* ========######## API OUTPUTS SECTION ########======== */}

          <section className={styles.apiContainer}>

            <div className={styles.api1}>
              {/* Car Value Evaluation Application integrated here */}
              <div className="min-h-min bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl">
                  <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                    Car Value Evaluation Application
                  </h1>

                  {/* Navigation/View Switcher for API 1 functionality */}
                  <div className="flex justify-center space-x-8 mb-8 flex-wrap">
                    <button
                      onClick={() => setView('history')}
                      className={`px-4 py-2 rounded-lg font-medium transition duration-300 mb-2 sm:mb-0 ${
                        view === 'history'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Calculation History
                    </button>
                    <button
                      onClick={() => setView('calculate')}
                      className={`px-4 py-2 rounded-lg font-medium transition duration-300 mb-2 sm:mb-0 ${
                        view === 'calculate'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Calculate New Value
                    </button>
                    <button
                      onClick={() => setView('carValueTest')}
                      className={`px-4 py-2 rounded-lg font-medium transition duration-300 mb-2 sm:mb-0 ${
                        view === 'carValueTest'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Test Car Value API (Batch)
                    </button>
                  </div>

                  {/* Loading and Error Messages for individual calculation */}
                  {loading && (
                    <div className="text-center text-blue-500 font-medium mb-4">
                      Calculating car value...
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                      <strong className="font-bold">Error:</strong>
                      <span className="block sm:inline ml-2">{error}</span>
                    </div>
                  )}

                  {/* Conditional Rendering based on 'view' state */}
                  {view === 'history' && (
                    <CarValueHistory history={carValueHistory} />
                  )}
                  {view === 'calculate' && (
                    <CalculateCarValueForm onCalculate={calculateCarValue} />
                  )}
                  {view === 'carValueTest' && (
                    // CarValueTester receives API URLs defined in the main API component
                    <CarValueTester TEST_DATA_API_URL={TEST_DATA_API_URL} CAR_VALUE_API_URL={CAR_VALUE_API_URL} />
                  )}
                </div>
              </div>
            </div>

            {/* Placeholder for API 2 */}
            <div className={styles.api2}>
              API 2
            </div>

            <div className={styles.api1}>API 1</div>

            <div className={styles.api2}>API 2</div>


            {/* Placeholder for API 3 */}
            <div className={styles.api3}>
              <h3>API 3 — Quote Calculation</h3>
              {quote ? (
                quote.error ? (
                  <p>Error: {quote.error}</p>
                ) : (
                  <>
                    <p>Monthly Premium: ${quote.monthly_premium}</p>
                    <p>Yearly Premium: ${quote.yearly_premium}</p>
                  </>
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* Placeholder for API 4 */}
            <div className={styles.api4}>
              <AgeExperienceForm />
            </div>
          </section>
         {/* ========######## FOOTER ########======== */}
          <Footer></Footer>

        </section>
      </main>
    </div>
  );
};

export default API;