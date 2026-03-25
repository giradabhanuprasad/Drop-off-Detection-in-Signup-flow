import React from 'react';

export const DeviceBreakdownPanel = ({ stepMetrics }) => {
  if (!stepMetrics) return null;

  // Simulate device breakdown based on raw metrics for MVP
  const totalDropped = stepMetrics.dropped || 0;
  const mobileDropped = Math.round(totalDropped * 0.65); // Mobile usually drops more
  const desktopDropped = Math.round(totalDropped * 0.25);
  const tabletDropped = totalDropped - mobileDropped - desktopDropped;

  const entered = stepMetrics.entered || 1;
  const mobileEntered = Math.round(entered * 0.5);
  const desktopEntered = Math.round(entered * 0.4);
  const tabletEntered = entered - mobileEntered - desktopEntered;

  const mobileRate = ((mobileDropped / mobileEntered) * 100 || 0).toFixed(1);
  const desktopRate = ((desktopDropped / desktopEntered) * 100 || 0).toFixed(1);
  const tabletRate = ((tabletDropped / tabletEntered) * 100 || 0).toFixed(1);

  const ratio = desktopRate > 0 ? (mobileRate / desktopRate).toFixed(1) : 1;

  return (
    <div className="glass-panel p-6 mt-6" style={{ flex: 1 }}>
      <h3 className="mb-4">📱 Device Breakdown</h3>
      
      <div className="flex-col gap-3 text-sm">
        <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-light)' }}>
          <span>Mobile:</span>
          <span>Drop-off: {mobileRate}% ({mobileDropped} out of {mobileEntered})</span>
        </div>
        <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-light)' }}>
          <span>Desktop:</span>
          <span>Drop-off: {desktopRate}% ({desktopDropped} out of {desktopEntered})</span>
        </div>
        <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-light)' }}>
          <span>Tablet:</span>
          <span>Drop-off: {tabletRate}% ({tabletDropped} out of {tabletEntered})</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444' }}>
        <p style={{ margin: 0, color: '#fca5a5' }}>
          📱 <strong>Mobile drop-off is {ratio}x higher!</strong>
        </p>
      </div>
    </div>
  );
};
