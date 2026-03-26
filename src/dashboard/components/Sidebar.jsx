import React from 'react';

export const Sidebar = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '⚏' }, // Using unicode for icons to avoid extra deps
    { id: 'funnels', label: 'Funnels', icon: '☍' },
    { id: 'ab_testing', label: 'A/B Testing', icon: '⚖️' },
    { id: 'drop_analysis', label: 'Drop Analysis', icon: '📉' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
  ];

  return (
    <div style={{ 
      width: 260, 
      borderRight: '1px solid var(--border-light)', 
      padding: '24px 16px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      flexShrink: 0,
      background: 'var(--bg-sidebar)'
    }}>
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-10 px-4">
        <div style={{ width: 28, height: 28, background: 'var(--accent-primary)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>SignalFlow</h2>
      </div>
      
      {/* Navigation section */}
      <div style={{ paddingLeft: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ANALYTICS</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{ 
              background: activeNav === item.id ? 'rgba(92, 111, 255, 0.15)' : 'transparent', 
              color: activeNav === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)', 
              fontWeight: activeNav === item.id ? 600 : 500,
              padding: '10px 16px', 
              borderRadius: 8, 
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
              width: '100%',
              fontSize: 14,
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
                if(activeNav !== item.id) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                }
            }}
            onMouseOut={(e) => {
                if(activeNav !== item.id) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Settings */}
        <button 
          onClick={() => setActiveNav('settings')}
          style={{
             background: activeNav === 'settings' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
             color: activeNav === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
             display: 'flex',
             alignItems: 'center',
             gap: 12,
             padding: '10px 16px',
             border: 'none',
             borderRadius: '8px',
             cursor: 'pointer',
             fontSize: 14,
             fontWeight: activeNav === 'settings' ? 600 : 500,
             transition: 'all 0.15s ease'
        }}>
           <span style={{ fontSize: 16 }}>⚙️</span> Settings
        </button>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>
               JD
            </div>
            <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>John Doe</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Admin</p>
            </div>
        </div>
      </div>
    </div>
  );
};
