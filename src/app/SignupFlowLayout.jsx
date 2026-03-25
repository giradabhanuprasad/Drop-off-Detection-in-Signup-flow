import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signalFlow } from '../sdk/tracker';
import { mockApi } from '../services/mockApi';
import { FLOW_THEMES } from './flowThemes';
import { DropOffReasonModal } from './DropOffReasonModal';

// === THEMED STEP RENDERER ===
const ThemedStep = ({ stepId, flow, theme, onNext, isLastStep, onSimulateDropOff }) => {
  const readableStep = stepId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stepIcon = theme.stepIcons?.[stepId] || '📋';
  const stepHint = theme.stepHints?.[stepId] || `Please complete the ${readableStep} step.`;

  useEffect(() => {
    signalFlow.trackPageView(stepId);
  }, [stepId]);

  // Determine which input types to show based on the stepId
  const renderInputs = () => {
    const s = stepId.toLowerCase();
    if (s.includes('email')) return <><input className="glass-input" type="email" placeholder="name@email.com" style={{ width: '100%', boxSizing: 'border-box' }} /></>;
    if (s.includes('phone')) return <><input className="glass-input" type="tel" placeholder="+1 (555) 000-0000" style={{ width: '100%', boxSizing: 'border-box' }} /></>;
    if (s.includes('otp') || s.includes('pin') || s.includes('verify')) return (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {[1,2,3,4,5,6].map(i => (
          <input key={i} type="text" maxLength={1} style={{ width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff' }} />
        ))}
      </div>
    );
    if (s.includes('upload') || s.includes('scan') || s.includes('selfie') || s.includes('id_')) return (
      <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📤</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>Click to upload or drag and drop</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>PDF, JPG, PNG — up to 10MB</p>
        <input type="file" style={{ display: 'none' }} />
      </div>
    );
    if (s.includes('ssn') || s.includes('password')) return <input className="glass-input" type="password" placeholder="••••••••••" style={{ width: '100%', letterSpacing: 4, boxSizing: 'border-box' }} />;
    if (s.includes('seat') || s.includes('select') || s.includes('role') || s.includes('grade') || s.includes('level')) return (
      <select className="glass-input" style={{ width: '100%', boxSizing: 'border-box' }}>
        <option disabled selected>Select an option...</option>
        <option>Option A</option>
        <option>Option B</option>
        <option>Option C</option>
      </select>
    );
    if (s.includes('address')) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="glass-input" type="text" placeholder="Street address" style={{ width: '100%', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="glass-input" type="text" placeholder="City" style={{ flex: 1, boxSizing: 'border-box' }} />
          <input className="glass-input" type="text" placeholder="ZIP" style={{ width: 100, boxSizing: 'border-box' }} />
        </div>
      </div>
    );
    if (s.includes('plaid') || s.includes('bank') || s.includes('payment') || s.includes('card')) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="glass-input" type="text" placeholder="Card number" style={{ width: '100%', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="glass-input" type="text" placeholder="MM / YY" style={{ flex: 1, boxSizing: 'border-box' }} />
          <input className="glass-input" type="text" placeholder="CVC" style={{ flex: 1, boxSizing: 'border-box' }} />
        </div>
      </div>
    );
    if (s.includes('optin') || s.includes('consent') || s.includes('hippa')) return (
      <div style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: 16, background: 'rgba(255,255,255,0.03)', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
        By continuing, you agree to our <span style={{ color: theme.accentColor }}>Terms of Service</span> and acknowledge our <span style={{ color: theme.accentColor }}>Privacy Policy</span>. We will handle your data securely and in compliance with applicable regulations.
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" /> <span style={{ color: '#fff' }}>I agree to the terms above</span>
          </label>
        </div>
      </div>
    );
    // Default generic text input
    return <input className="glass-input" type="text" placeholder={`Enter ${readableStep.toLowerCase()}`} style={{ width: '100%', boxSizing: 'border-box' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Step icon + heading */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>{stepIcon}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fff' }}>{readableStep}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>{stepHint}</p>
      </div>

      {/* The themed input */}
      {renderInputs()}

      {/* Continue Button */}
      <button
        style={{
          width: '100%', height: 50, borderRadius: 12, border: 'none',
          background: theme.accentColor, color: '#fff', fontWeight: 700, fontSize: 16,
          cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)'
        }}
        onClick={() => {
          signalFlow.trackCompletion(stepId);
          if (isLastStep) {
            alert('🎉 Flow Completed! Check your dashboard for insights.');
            window.location.href = '/dashboard';
          } else {
            onNext();
          }
        }}
      >
        {isLastStep ? '🚀 Complete' : 'Continue →'}
      </button>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

      {/* Simulate Drop-off */}
      <button
        onClick={onSimulateDropOff}
        style={{
          width: '100%', height: 48, borderRadius: 12,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.35)',
          color: '#fca5a5', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', fontFamily: 'var(--font-sans)'
        }}
      >
        🛑 Simulate Drop-off Here
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
        Triggers AI root-cause analysis &amp; generates a targeted code fix
      </p>
    </div>
  );
};

// === FLOW SELECTOR CARD ===
const FlowCard = ({ flowId, flow, theme, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-card)',
      border: `1px solid ${theme.accentColor}33`,
      borderRadius: 16, padding: 24, cursor: 'pointer',
      transition: 'all 0.25s',
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden'
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = theme.accentColor + '99';
      e.currentTarget.style.boxShadow = `0 12px 40px ${theme.accentColor}22`;
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = theme.accentColor + '33';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    {/* Background glow */}
    <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: theme.accentColor, opacity: 0.06, pointerEvents: 'none' }} />
    
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${theme.accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {theme.icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>{flow.name}</h3>
        <p style={{ margin: 0, fontSize: 12, color: theme.accentColor }}>{theme.tagline}</p>
      </div>
    </div>

    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
      {flow.steps.length} simulated friction points
    </p>

    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {flow.steps.slice(0, 4).map(s => (
        <span key={s} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: `${theme.accentColor}18`, color: theme.accentColor, border: `1px solid ${theme.accentColor}33` }}>
          {theme.stepIcons?.[s] || '•'} {s.replace(/_/g, ' ')}
        </span>
      ))}
      {flow.steps.length > 4 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{flow.steps.length - 4} more</span>}
    </div>
  </div>
);

// === MAIN LAYOUT ===
const SignupFlowLayout = () => {
  const navigate = useNavigate();
  const [flows, setFlows] = useState({});
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showReasonModal, setShowReasonModal] = useState(false);

  useEffect(() => {
    const tryLoad = () => {
      const loaded = mockApi.getFlows();
      if (Object.keys(loaded).length > 0) setFlows(loaded);
      else setTimeout(tryLoad, 400);
    };
    tryLoad();
  }, []);

  const handleDropOffSubmit = async (reasonData) => {
    setShowReasonModal(false);
    signalFlow.trackDropOff(reasonData.step, {
      reason: reasonData.reason,
      reasonCategory: reasonData.category,
      categoryLabel: reasonData.categoryLabel,
      userTypedReason: reasonData.userTypedReason,
      imageBase64: reasonData.imageBase64 || null,
      flow: reasonData.flow,
    });
    // Brief delay so the event is processed, then redirect
    await new Promise(r => setTimeout(r, 600));
    navigate('/dashboard?tab=drop_analysis');
  };

  if (Object.keys(flows).length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
        Connecting to backend...
      </div>
    );
  }

  // === SELECTOR SCREEN ===
  if (!selectedFlowId) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-app)', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
              Select a Signup Flow to Simulate
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              8 distinct industry workflows. Simulate drop-offs, collect user reasons, and generate AI code patches instantly.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {Object.entries(flows).map(([id, flow]) => {
              const theme = FLOW_THEMES[id] || { accentColor: '#5c6fff', icon: '📋', tagline: '', name: flow.name, stepIcons: {}, stepHints: {} };
              return (
                <FlowCard
                  key={id}
                  flowId={id}
                  flow={flow}
                  theme={theme}
                  onClick={() => { setSelectedFlowId(id); setCurrentStepIndex(0); }}
                />
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="secondary-button" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === STEP SIMULATOR ===
  const activeFlow = flows[selectedFlowId];
  const theme = FLOW_THEMES[selectedFlowId] || { accentColor: '#5c6fff', gradient: 'var(--bg-app)', icon: '📋', tagline: '', name: activeFlow.name, stepIcons: {}, stepHints: {} };
  const activeStepId = activeFlow.steps[currentStepIndex];
  const isLastStep = currentStepIndex === activeFlow.steps.length - 1;

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, fontFamily: 'var(--font-sans)' }}>
      {/* Drop-off Reason Modal */}
      {showReasonModal && (
        <DropOffReasonModal
          stepName={activeStepId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          flowName={activeFlow.name}
          onSubmit={handleDropOffSubmit}
          onCancel={() => setShowReasonModal(false)}
        />
      )}

      {/* Top Nav Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => setSelectedFlowId(null)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Switch Flow
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{theme.icon}</span>
          <span style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>{activeFlow.name}</span>
        </div>

        {/* Step progress dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {activeFlow.steps.map((_, idx) => (
            <div key={idx} style={{
              width: idx === currentStepIndex ? 24 : 8,
              height: 8, borderRadius: 4,
              background: idx <= currentStepIndex ? theme.accentColor : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </div>

      {/* Centered Step Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 73px)', padding: '40px 20px' }}>
        <div style={{
          width: '100%', maxWidth: 440,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: 40,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)`
        }}>
          {/* Step counter */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: theme.accentColor, textTransform: 'uppercase' }}>
              Step {currentStepIndex + 1} of {activeFlow.steps.length}
            </span>
          </div>

          <ThemedStep
            key={activeStepId}
            stepId={activeStepId}
            flow={activeFlow}
            theme={theme}
            onNext={() => setCurrentStepIndex(i => i + 1)}
            isLastStep={isLastStep}
            onSimulateDropOff={() => setShowReasonModal(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupFlowLayout;
