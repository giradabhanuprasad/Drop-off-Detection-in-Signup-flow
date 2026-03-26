import React, { useState, useEffect } from 'react';

export const SettingsHub = () => {
    const [apiKey, setApiKey] = useState('sk_live_abc123xyz_v1');
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('sf_theme') || 'dark');
    
    const [isEditingAdmin, setIsEditingAdmin] = useState(false);
    const [adminName, setAdminName] = useState('John Doe');
    const [adminEmail, setAdminEmail] = useState('john.doe@company.com');
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sf_theme', theme);
    }, [theme]);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateNewKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'sk_live_';
        for (let i = 0; i < 24; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setApiKey(result);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: 40, maxWidth: 800 }}>
            {/* API Keys */}
            <div className="glass-panel" style={{ padding: 32, marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>🔑 API Keys</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, marginTop: 0 }}>Use this key to initialize the SignalFlow SDK in your frontend application.</p>
                
                <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input 
                            type="text" 
                            readOnly 
                            value={apiKey} 
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-medium)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 14 }}
                        />
                        <button onClick={handleCopy} style={{ position: 'absolute', right: 8, top: 8, padding: '4px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-light)', borderRadius: 4, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <button className="primary-button" onClick={generateNewKey}>Roll Key</button>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--warning)' }}>⚠️ Rolling your key will immediately invalidate the previous key. Update your production app immediately.</div>
            </div>

            {/* Team Members */}
            <div className="glass-panel" style={{ padding: 32, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>👥 Team Members</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>Manage who has access to this workspace.</p>
                    </div>
                    <button className="secondary-button" style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none' }}>+ Invite Member</button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        <div>User</div>
                        <div>Role</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                    </div>
                    {/* Admin Profile */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '16px', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>
                                {adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            {isEditingAdmin ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                                    <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="glass-input" style={{ padding: '4px 8px', fontSize: 13 }} />
                                    <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="glass-input" style={{ padding: '4px 8px', fontSize: 12 }} />
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{adminName} (You)</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{adminEmail}</div>
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Owner</div>
                        <div style={{ textAlign: 'right' }}>
                            {isEditingAdmin ? (
                                <button onClick={() => setIsEditingAdmin(false)} style={{ background: 'var(--success)', color: '#111', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Save</button>
                            ) : (
                                <button onClick={() => setIsEditingAdmin(true)} style={{ background: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Edit Profile</button>
                            )}
                        </div>
                    </div>
                    {/* Secondary Member */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffbd2e', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>SM</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>Sarah Miller</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>sarah@company.com</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Developer</div>
                        <div style={{ textAlign: 'right' }}>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>Remove</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Theme */}
            <div className="glass-panel" style={{ padding: 32 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>🎨 Appearance</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, marginTop: 0 }}>Customize how SignalFlow looks on this device.</p>
                
                <div style={{ display: 'flex', gap: 16 }}>
                    <button 
                        onClick={() => setTheme('light')}
                        style={{ flex: 1, padding: 24, borderRadius: 8, border: theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', background: '#ffffff', color: '#111827', cursor: 'pointer', textAlign: 'center', fontWeight: 600, transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>☀️</span>
                        Light Mode
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        style={{ flex: 1, padding: 24, borderRadius: 8, border: theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', background: '#111827', color: '#ffffff', cursor: 'pointer', textAlign: 'center', fontWeight: 600, transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>🌙</span>
                        Dark Mode
                    </button>
                </div>
            </div>

        </div>
    );
};
