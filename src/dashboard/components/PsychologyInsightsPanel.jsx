import React from 'react';

// Derives psychology insights from step metrics without any async call
function deriveInsights(stepMetrics) {
  if (!stepMetrics) return [];
  const insights = [];
  const rageClickPct = ((stepMetrics.rageClicks / stepMetrics.entered) * 100) || 0;
  const tabSwitchPct = ((stepMetrics.tabSwitches / stepMetrics.entered) * 100) || 0;
  const dropPct = ((stepMetrics.dropped / stepMetrics.entered) * 100) || 0;
  const errorPct = ((stepMetrics.errors / stepMetrics.entered) * 100) || 0;

  if (rageClickPct > 5) {
    insights.push({
      type: 'warning',
      title: '😤 Frustration Detected',
      desc: `${rageClickPct.toFixed(1)}% of users rage-clicked on this step, signalling UI blocking friction.`
    });
  }
  if (tabSwitchPct > 10) {
    insights.push({
      type: 'warning',
      title: '🔍 Users Seeking Help Externally',
      desc: `${tabSwitchPct.toFixed(1)}% of users switched tabs — likely searching for information you should provide inline.`
    });
  }
  if (errorPct > 8) {
    insights.push({
      type: 'warning',
      title: '⚠️ High Validation Error Rate',
      desc: `${errorPct.toFixed(1)}% of users hit an error here. Input validation or format guidance may be unclear.`
    });
  }
  if (dropPct > 20) {
    insights.push({
      type: 'warning',
      title: '🚪 Premature Exit Spike',
      desc: `Over ${dropPct.toFixed(1)}% of users are abandoning here. The step may feel too invasive or too complex.`
    });
  }
  if (insights.length === 0) {
    insights.push({
      type: 'positive',
      title: '✅ No Major Friction Detected',
      desc: 'This step shows healthy user progression. No immediate psychological drop-off patterns.'
    });
  }
  return insights;
}

export const PsychologyInsightsPanel = ({ stepMetrics }) => {
  const insights = deriveInsights(stepMetrics);

  return (
    <div className="glass-panel p-6" style={{ flex: 1 }}>
      <h3 className="mb-4">🧠 Psychology Insights</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((insight, idx) => (
          <div key={idx} style={{
            padding: '14px',
            borderRadius: '8px',
            borderLeft: `4px solid ${insight.type === 'warning' ? '#f59e0b' : '#10b981'}`,
            background: insight.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)'
          }}>
            <h4 style={{ marginBottom: '4px', fontSize: 14, color: insight.type === 'warning' ? '#fcd34d' : '#6ee7b7' }}>
              {insight.title}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              {insight.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

