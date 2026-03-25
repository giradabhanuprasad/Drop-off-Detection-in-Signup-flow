import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="app-container flex justify-center items-center" style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <div className="glass-panel" style={{ width: '600px', padding: '40px' }}>
        
        {step === 1 && (
          <div className="flex-col gap-6">
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome to SignalFlow</h2>
            <p className="text-secondary">Let's get you set up in 2 minutes.</p>
            
            <input type="text" className="glass-input mt-4 w-full p-3" placeholder="Email" />
            <input type="password" className="glass-input mt-4 w-full p-3" placeholder="Password" />
            <input type="text" className="glass-input mt-4 w-full p-3" placeholder="Company Name" />
            
            <button className="primary-button mt-6 w-full" onClick={() => setStep(2)}>Sign Up</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-6">
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Define Your Signup Flow</h2>
            <p className="text-secondary">What steps are in your signup flow that you want to track?</p>
            
            <div className="flex-col gap-2 mt-4">
              <div className="flex items-center gap-4"><span>Step 1:</span> <input className="glass-input p-2 flex-1" value="Email Entry" readOnly /></div>
              <div className="flex items-center gap-4"><span>Step 2:</span> <input className="glass-input p-2 flex-1" value="OTP Verification" readOnly /></div>
              <div className="flex items-center gap-4"><span>Step 3:</span> <input className="glass-input p-2 flex-1" placeholder="e.g. Profile Setup" /></div>
            </div>
            
            <div className="flex gap-4 mt-6">
                <button className="secondary-button" onClick={() => setStep(1)}>Back</button>
                <button className="primary-button flex-1" onClick={() => setStep(3)}>Use Template & Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col gap-6">
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Install Tracking SDK</h2>
            <p className="text-secondary">Add this code to the &lt;head&gt; of your signup pages:</p>
            
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', color: '#a5b4fc', border: '1px solid var(--border-light)' }}>
{`<!-- SignalFlow Analytics -->
<script src="https://cdn.signalflow.ai/sdk.js"></script>
<script>
  SignalFlow.init({
    apiKey: 'sk_live_abc123xyz',
    funnelId: 'default_signup',
    steps: ['email', 'otp', 'profile']
  });
</script>`}
            </pre>
            
            <div className="flex gap-4 mt-6">
                <button className="secondary-button" onClick={() => setStep(2)}>Back</button>
                <button className="primary-button flex-1" onClick={() => setStep(4)}>Test Installation</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-col gap-6">
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Testing Installation...</h2>
            
            <div className="flex-col gap-4 mt-4 p-4" style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="flex items-center gap-2"><span style={{ color: '#10b981' }}>✅</span> SDK loaded successfully</div>
              <div className="flex items-center gap-2" style={{ animationDelay: '0.2s' }}><span style={{ color: '#10b981' }}>✅</span> API key validated</div>
              <div className="flex items-center gap-2" style={{ animationDelay: '0.4s' }}><span style={{ color: '#10b981' }}>✅</span> First event received</div>
            </div>

            <p className="text-sm mt-4 text-center">Great! You're all set. Data will appear in ~5 minutes.</p>
            
            <button className="primary-button mt-6 w-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        )}

      </div>
    </div>
  );
};
