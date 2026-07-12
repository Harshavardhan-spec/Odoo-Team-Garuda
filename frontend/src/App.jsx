import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout wrappers
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// View Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Expenses from './pages/Expenses';
import NotFound from './pages/NotFound';

/**
 * Route guard component to check authorization state.
 * Currently configured to pass through for out-of-the-box boilerplate compilation.
 */
const ProtectedRoute = ({ children }) => {
  // TODO: Integrate with AuthContext states to redirect unauthenticated users to /login
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Secure ERP Operations Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
