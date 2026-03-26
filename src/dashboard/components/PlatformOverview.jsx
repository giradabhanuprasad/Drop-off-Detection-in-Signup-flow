import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color, trend, onClick }) => (
  <div 
    className="glass-panel cursor-pointer hover:border-indigo-500/50 transition-all duration-200" 
    onClick={onClick}
    style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 8, borderColor: `${color}22`, cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s', ':hover': onClick ? { transform: 'translateY(-2px)' } : {} }}
    onMouseOver={(e) => { if(onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; } }}
    onMouseOut={(e) => { if(onClick) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${color}22`; } }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      {trend && (
        <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: trend > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: trend > 0 ? '#22c55e' : '#ef4444' }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>{value}</div>
    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>}
  </div>
);

// ─── Top Drop-off List ──────────────────────────────────────────────────────
const TopDropOffList = ({ stepMetrics }) => {
  const ranked = useMemo(() => {
    if (!stepMetrics) return [];
    return Object.entries(stepMetrics)
      .map(([id, m]) => ({ id, name: m.name || id, dropRate: m.entered > 0 ? Math.round((m.dropped / m.entered) * 100) : 0, dropped: m.dropped }))
      .sort((a, b) => b.dropRate - a.dropRate)
      .slice(0, 8);
  }, [stepMetrics]);

  const max = ranked[0]?.dropRate || 1;

  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>🔥 Top Drop-off Points</h3>
      {ranked.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Run a simulation to populate this list.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ranked.map((step, idx) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 18, flexShrink: 0 }}>#{idx + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{step.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: step.dropRate > 25 ? '#ef4444' : step.dropRate > 15 ? '#f59e0b' : '#94a3b8' }}>
                    {step.dropRate}%
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(step.dropRate / max) * 100}%`, borderRadius: 3,
                      background: step.dropRate > 25 ? 'linear-gradient(90deg,#ef4444,#f97316)' : step.dropRate > 15 ? '#f59e0b' : '#6366f1',
                      transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 55, textAlign: 'right', flexShrink: 0 }}>
                {step.dropped.toLocaleString()} lost
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Live Feed ──────────────────────────────────────────────────────────────
const LiveFeedPanel = ({ alerts }) => {
  const recent = (alerts || []).slice(0, 6);
  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>⚡ Live Activity</h3>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse 2s infinite' }} />
          Real-time
        </span>
      </div>
      {recent.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          No events yet. <a href="/signup" style={{ color: '#6366f1' }}>Run a simulation →</a>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px',
                background: 'rgba(239,68,68,0.05)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{a.message}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Quick Actions ──────────────────────────────────────────────────────────
const QuickActions = ({ navigate }) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerLiveSimulation = async () => {
    setIsSimulating(true);
    const mockSteps = ['email', 'otp', 'profile', 'payment'];
    const fakeEvents = [];
    
    // Simulate 50 new people doing interactions
    for (let i = 0; i < 50; i++) {
        let step = mockSteps[Math.floor(Math.random() * mockSteps.length)];
        fakeEvents.push({ step, type: 'page_view' });
        
        if (Math.random() > 0.5) fakeEvents.push({ step, type: 'step_complete' });
        else {
            fakeEvents.push({ step, type: 'explicit_dropoff', properties: { reasonCategory: 'confusion', userTypedReason: 'I am confused by this form.' } });
            if (Math.random() > 0.5) fakeEvents.push({ step, type: 'rage_click' });
            if (Math.random() > 0.5) fakeEvents.push({ step, type: 'validation_error' });
        }
    }

    try {
        await fetch('http://localhost:3001/api/v1/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: fakeEvents })
        });
        setTimeout(() => setIsSimulating(false), 800);
    } catch(e) {
        console.error("Simulation failed", e);
        setIsSimulating(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>⚡ Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: '🧪', label: isSimulating ? 'Simulating Traffic...' : 'Run a New Simulation', sub: 'Inject 50 randomized user sessions to backend', action: triggerLiveSimulation, color: '#6366f1' },
          { icon: '📊', label: 'View Funnel Analysis', sub: 'Deep-dive into step-level drop-off', path: null, tab: 'funnels', color: '#38bdf8' },
          { icon: '🔍', label: 'Inspect Drop-offs', sub: 'Review AI root-cause findings', path: null, tab: 'drop_analysis', color: '#ef4444' },
          { icon: '🔔', label: 'Check Alerts', sub: 'See all active critical warnings', path: null, tab: 'alerts', color: '#f59e0b' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => action.action ? action.action() : action.path ? navigate(action.path) : navigate(`/dashboard?tab=${action.tab}`)}
            disabled={isSimulating && action.icon === '🧪'}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                background: `${action.color}08`, border: `1px solid ${action.color}22`,
                borderRadius: 12, cursor: (isSimulating && action.icon === '🧪') ? 'wait' : 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.2s', fontFamily: 'var(--font-sans)', opacity: (isSimulating && action.icon === '🧪') ? 0.6 : 1 }}
            onMouseOver={e => { if (!(isSimulating && action.icon === '🧪')) { e.currentTarget.style.background = `${action.color}14`; e.currentTarget.style.borderColor = `${action.color}55`; } }}
            onMouseOut={e => { if (!(isSimulating && action.icon === '🧪')) { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.borderColor = `${action.color}22`; } }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{action.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>{action.label}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{action.sub}</p>
            </div>
            <span style={{ marginLeft: 'auto', color: action.color, fontSize: 18 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const PlatformOverview = ({ stepMetrics, alerts, insights, flows }) => {
  const navigate = useNavigate();

  // Compute aggregate KPIs
  const kpis = useMemo(() => {
    if (!stepMetrics || !flows) return { totalEntered: 0, totalDropped: 0, avgDropRate: 0, criticalSteps: 0 };
    
    // Find all step IDs that are NOT the first step in any flow
    const nonRootSteps = new Set();
    Object.values(flows).forEach(f => {
      if (f.steps && f.steps.length > 1) {
        f.steps.slice(1).forEach(s => nonRootSteps.add(s));
      }
    });

    const entries = Object.entries(stepMetrics);
    
    // Total users is sum of entered at root steps ONLY to prevent double-counting
    const totalEntered = entries.reduce((s, [id, m]) => {
      return nonRootSteps.has(id) ? s : s + (m.entered || 0);
    }, 0);

    const totalDropped = entries.reduce((s, [id, m]) => s + (m.dropped || 0), 0);
    const avgDropRate = entries.length ? Math.round(entries.reduce((s, [id, m]) => s + (m.entered > 0 ? (m.dropped / m.entered) * 100 : 0), 0) / entries.length) : 0;
    const criticalSteps = entries.filter(([id, m]) => m.entered > 0 && (m.dropped / m.entered) * 100 > 20).length;
    
    return { totalEntered, totalDropped, avgDropRate, criticalSteps };
  }, [stepMetrics, flows]);

  const overallConversion = kpis.totalEntered > 0
    ? Math.round(((kpis.totalEntered - kpis.totalDropped) / kpis.totalEntered) * 100)
    : 0;

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>
          Real-time conversion health across all your signup funnels
        </p>
      </div>

      {/* KPI Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Users Tracked" value={kpis.totalEntered.toLocaleString()} sub="All simulated funnel entries" color="#6366f1" trend={7} onClick={() => navigate('/dashboard?tab=funnels')}  />
        <StatCard icon="🚪" label="Users Dropped Off" value={kpis.totalDropped.toLocaleString()} sub="Abandoned before completing" color="#ef4444" trend={-12} onClick={() => navigate('/dashboard?tab=funnels')} />
        <StatCard icon="✅" label="Overall Conversion" value={`${overallConversion}%`} sub="Users who reached the final step" color="#22c55e" trend={3} onClick={() => navigate('/dashboard?tab=funnels')} />
        <StatCard icon="⚠️" label="Critical Drop Points" value={kpis.criticalSteps} sub="Steps with >20% drop rate" color="#f59e0b" onClick={() => navigate('/dashboard?tab=funnels')} />
        <StatCard icon="📋" label="Open AI Insights" value={(insights || []).length} sub="Pending code fixes to review" color="#38bdf8" onClick={() => navigate('/dashboard?tab=drop_analysis')} />
        <StatCard icon="🔔" label="Active Alerts" value={(alerts || []).filter(a => !a.read).length} sub="Unread critical notifications" color="#a855f7" onClick={() => navigate('/dashboard?tab=alerts')} />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <TopDropOffList stepMetrics={stepMetrics} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <QuickActions navigate={navigate} />
        </div>
      </div>

      {/* Live Feed — full width */}
      <LiveFeedPanel alerts={alerts} />
    </div>
  );
};

export default PlatformOverview;
