import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import SignupFlowLayout from './app/SignupFlowLayout';
import { OnboardingWizard } from './dashboard/OnboardingWizard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to setup */}
        <Route path="/" element={<Navigate to="/setup" replace />} />
        
        {/* Onboarding Wizard Route */}
        <Route path="/setup/*" element={<OnboardingWizard />} />
        
        {/* Developer Dashboard Route */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        
        {/* Dummy Signup App Route */}
        <Route path="/signup/*" element={<SignupFlowLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
