import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LiveClientApp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [clickCount, setClickCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simulate Rage Clicks
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long.');
            
            // If they rage click (3+ times) and fail, send a Live User Exception!
            if (newCount >= 3) {
                setIsSubmitting(true);
                try {
                    await fetch('http://localhost:3001/api/v1/user-exceptions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email || 'anonymous@user.com',
                            reason: 'User rage-clicked the Submit button repeatedly after failing password validation.',
                            context: 'SignupCheckoutForm'
                        })
                    });
                } catch(e) {
                    console.error("Failed to send tracking exception");
                }
                setTimeout(() => setIsSubmitting(false), 500);
            }
            return;
        }

        // Success state
        setErrorMsg('');
        alert("Success! You have signed up.");
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif', display: 'flex' }}>
            {/* Split layout to make it look like a real consumer app */}
            <div style={{ flex: 1, padding: '40px 60px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, background: '#3b82f6', borderRadius: 8 }}></div>
                        Acme SaaS
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                        ← Back to SignalFlow Dashboard
                    </button>
                </div>

                <div style={{ maxWidth: 440, margin: 'auto', width: '100%' }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Create your account</h1>
                    <p style={{ color: '#64748b', marginBottom: 32 }}>Start your 14-day free trial. No credit card required.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Work Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, background: '#fff', color: '#000' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: errorMsg ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: 15, background: '#fff', color: '#000' }}
                            />
                            {errorMsg && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 6, fontWeight: 500 }}>{errorMsg}</div>}
                        </div>

                        <button 
                            type="submit" 
                            style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8, transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            {isSubmitting ? 'Processing...' : 'Create Account'}
                        </button>

                        {clickCount >= 3 && (
                            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, marginTop: 16, fontSize: 13, color: '#991b1b' }}>
                                <strong>💡 Demo Note:</strong> You have clicked Submit 3 times with an error. The SignalFlow SDK has just secretly transmitted your email ({email || 'anonymous'}) and behavior directly to the Developer Dashboard as a Critical Exception! Check the Alerts tab!
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div style={{ flex: 1, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <div style={{ maxWidth: 400, textAlign: 'center' }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Join 10,000+ companies</h2>
                    <p style={{ color: '#475569', lineHeight: 1.6 }}>"Acme SaaS completely transformed how we do business. Highly recommended for any serious team."</p>
                </div>
            </div>
        </div>
    );
};
