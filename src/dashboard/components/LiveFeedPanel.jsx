import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';

// Generates a mock live event for display purposes
function formatEvent(alert) {
  const step = alert.message.split(': ')[1] || 'unknown';
  const timeAgo = Math.floor((Date.now() - alert.timestamp) / 1000);
  const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;
  return { step, timeStr, isCritical: !alert.read, id: alert.id };
}

export const LiveFeedPanel = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsub = mockApi.subscribe(({ alerts }) => {
      // Show the 6 most recent simulated events
      setEvents(alerts.slice(0, 6).map(formatEvent));
    });
    return unsub;
  }, []);

  return (
    <div className="glass-panel" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>⚡ Live Activity</h3>
        {/* Pulsing green dot */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)' }}>
          <span style={{
            width: 8, height: 8, background: 'var(--success)', borderRadius: '50%',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></span>
          Live
        </span>
      </div>

      {events.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No events yet. <br />
          <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}
            onClick={() => window.location.href = '/signup'}>
            Launch the Simulator →
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {events.map((event, i) => (
            <div key={event.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8,
              background: event.isCritical ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255,255,255,0.03)',
              borderLeft: `3px solid ${event.isCritical ? 'var(--danger)' : 'var(--border-medium)'}`,
              animation: i === 0 ? 'fadeIn 0.4s ease-out' : 'none'
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {event.isCritical ? '🚨 ' : '📊 '}{event.step.replace(/_/g, ' ')}
                </span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>
                  {event.isCritical ? 'Critical drop-off detected' : 'Behavioural signal recorded'}
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                {event.timeStr}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
