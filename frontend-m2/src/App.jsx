
import {Routes,Route} from 'react-router-dom';
import API from './pages/api';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<API />} />
      </Routes>
    </>
  );
}

export default App
