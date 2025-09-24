import './App.css';
import LandingPage from './Components/LandingPage';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import logo from './images/logo.png';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
