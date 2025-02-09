import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import "./index.css";
import HeroSection from "./components/HeroSection";
import Dashboard from "./components/Dashboard";
import RegistrationForm from "./components/profileDetail";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";
import { useCountryRedirect } from "./countryRouter";

// Country Router Component
const CountryRouter = ({ children }) => {
  useCountryRedirect();
  return children;
};
  
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <CountryRouter> */}
          <Routes>
            {/* India routes */}
            <Route path="/in">
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <RegistrationForm />
                </ProtectedRoute>
              } />
              <Route path="" element={<HeroSection />} />
              <Route path="login" element={<HeroSection />} />
            </Route>

            {/* UK routes */}
            <Route path="/uk">
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <RegistrationForm />
                </ProtectedRoute>
              } />
              <Route path="" element={<HeroSection />} />
              <Route path="login" element={<HeroSection />} />
            </Route>

            {/* US/Default routes */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <RegistrationForm />
              </ProtectedRoute>
            } />
            <Route path="/" element={<HeroSection userCurrency = "USD" userCountry="US" />} />
            <Route path="/login" element={<HeroSection userCurrency = "USD" userCountry="US" />} />
          </Routes>
        {/* </CountryRouter> */}
      </AuthProvider>
    </Router>
  );
}

export default App;