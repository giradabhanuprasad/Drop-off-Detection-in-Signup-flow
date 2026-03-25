import React from 'react';

export const BehavioralSignalsPanel = ({ stepMetrics }) => {
  if (!stepMetrics) return null;

  // Convert raw counts into percentages for visual impact based on entered users
  const rageClickPct = ((stepMetrics.rageClicks / stepMetrics.entered) * 100 || 0).toFixed(1);
  const backButtonPct = ((stepMetrics.backButtons / stepMetrics.entered) * 100 || 0).toFixed(1);
  const tabSwitchPct = ((stepMetrics.tabSwitches / stepMetrics.entered) * 100 || 0).toFixed(1);

  return (
    <div className="glass-panel p-6" style={{ flex: 1 }}>
      <h3 className="mb-4">Behavioral Signals for {stepMetrics.name}</h3>
      <div className="flex-col gap-4">
        <div className="flex justify-between items-center" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '20px' }}>🔥</span>
            <div>
              <div style={{ fontWeight: 600 }}>Rage Clicks</div>
              <div className="text-secondary text-sm">Rapid sequential clicks indicating frustration</div>
            </div>
          </div>
          <div className="text-right">
             <div className={`${rageClickPct > 10 ? 'text-danger' : 'text-warning'}`} style={{ fontSize: '18px', fontWeight: 600 }}>
               {rageClickPct}%
             </div>
             <div className="text-sm text-secondary">({Math.round(stepMetrics.rageClicks)} users)</div>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '20px' }}>⏸️</span>
            <div>
              <div style={{ fontWeight: 600 }}>Hesitation</div>
              <div className="text-secondary text-sm">Cursor stopped for 5+ seconds</div>
            </div>
          </div>
          <div className="text-right">
             <div style={{ fontSize: '18px', fontWeight: 600 }}>
               {stepMetrics.avgTime}s avg
             </div>
             <div className="text-sm text-secondary">({Math.round(stepMetrics.hesitation)} events)</div>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '20px' }}>🔄</span>
            <div>
              <div style={{ fontWeight: 600 }}>Tab Switches</div>
              <div className="text-secondary text-sm">User left page mid-step</div>
            </div>
          </div>
          <div className="text-right">
             <div className={`${tabSwitchPct > 20 ? 'text-warning' : 'text-primary'}`} style={{ fontSize: '18px', fontWeight: 600 }}>
               {tabSwitchPct}%
             </div>
             <div className="text-sm text-secondary">({Math.round(stepMetrics.tabSwitches)} users)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
