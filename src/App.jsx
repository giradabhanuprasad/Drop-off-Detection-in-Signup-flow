import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import SignupFlowLayout from './app/SignupFlowLayout';
import { OnboardingWizard } from './dashboard/OnboardingWizard';
import { LiveClientApp } from './demo/LiveClientApp';

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
        
        {/* Live User Exception Demo Route */}
        <Route path="/live-client-demo/*" element={<LiveClientApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
