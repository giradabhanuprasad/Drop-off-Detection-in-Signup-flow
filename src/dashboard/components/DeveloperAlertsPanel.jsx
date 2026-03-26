import React, { useState } from 'react';
import { CodePatchRenderer } from './CodePatchRenderer';
import { SessionReplayModal } from './SessionReplayModal';

export const DeveloperAlertsPanel = ({ alerts, insights, onMarkRead }) => {
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Drop Points');
  const [replayAlert, setReplayAlert] = useState(null);

  const toggleExpand = (id) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'All Drop Points') return true;
    if (activeFilter === 'Critical') return alert.type === 'critical' || alert.message.toLowerCase().includes('critical');
    if (activeFilter === 'Warning') return alert.type === 'warning' || alert.message.toLowerCase().includes('warning');
    if (activeFilter === 'Technical Error') return alert.type === 'technical' || alert.message.toLowerCase().includes('error');
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* existing headers and summary cards remain unchanged */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
             <span style={{ color: 'var(--danger)' }}>📉</span> Drop Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            All detected drop-off points across your funnels, with root cause detection and developer fix recommendations.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
         <div className="glass-panel" style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>❗</div>
            <div>
               <h3 style={{ fontSize: 24, margin: 0, color: 'var(--danger)' }}>{alerts.filter(a => !a.read).length}</h3>
               <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Critical Drop Points</p>
            </div>
         </div>
         <div className="glass-panel" style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, background: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
            <div>
               <h3 style={{ fontSize: 24, margin: 0, color: 'var(--warning)' }}>
                 {insights.filter(i => i.userTypedReason).length}
               </h3>
               <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>User-Reported Reasons</p>
            </div>
         </div>
         <div className="glass-panel" style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(92, 111, 255, 0.15)', color: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📸</div>
            <div>
               <h3 style={{ fontSize: 24, margin: 0, color: 'var(--accent-primary)' }}>
                 {insights.filter(i => i.hasScreenshot).length}
               </h3>
               <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Screenshots Attached</p>
            </div>
         </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
         {['All Drop Points', 'Critical', 'Warning', 'Technical Error'].map(filter => (
           <button 
             key={filter}
             onClick={() => setActiveFilter(filter)}
             className="secondary-button" 
             style={{ 
               background: activeFilter === filter ? 'var(--accent-primary)' : 'transparent', 
               color: activeFilter === filter ? '#fff' : 'inherit', 
               border: activeFilter === filter ? 'none' : undefined, 
               padding: '6px 16px', 
               borderRadius: 20, 
               fontSize: 13 
             }}>
             {filter}
           </button>
         ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No active drops detected for this filter. You are running smoothly!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredAlerts.map(alert => {
            const insight = insights.find(i => i.id === alert.insightId);
            const isExpanded = expandedAlertId === alert.id;

            const stepName = alert.message.split(': ')[1]?.toUpperCase() || 'UNKNOWN STEP';
            const dropRate = insight ? '27.4%' : 'Unknown';
            const usersLost = insight ? '1,191' : '0';

            return (
              <div key={alert.id} className="glass-panel" style={{
                 overflow: 'hidden',
                 transition: 'all 0.3s ease',
                 borderLeft: alert.read ? '3px solid var(--border-medium)' : '3px solid var(--danger)'
              }}>
                {/* List Row Header */}
                <div
                  onClick={() => toggleExpand(alert.id)}
                  style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', cursor: 'pointer', gap: 24, background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                >
                   {/* Left side info */}
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                         <span className="tag-info">SignalFlow Signup</span>
                         <span className={alert.read ? 'tag-warning' : 'tag-critical'}>
                            {alert.read ? 'UX Friction' : 'Critical Drop'}
                         </span>
                         {insight?.userTypedReason && (
                           <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(92,111,255,0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(92,111,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                             ✍️ User Reported
                           </span>
                         )}
                         {insight?.hasScreenshot && (
                           <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                             📸 Screenshot
                           </span>
                         )}
                      </div>
                      <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{stepName}</h4>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                         {insight?.userTypedReason
                           ? <><strong style={{ color: 'rgba(255,255,255,0.7)' }}>User: </strong><em>"{insight.userTypedReason.slice(0, 120)}{insight.userTypedReason.length > 120 ? '…' : ''}"</em></>
                           : insight?.cause || alert.details
                         }
                      </p>
                   </div>

                   {/* Right side stats */}
                   <div style={{ display: 'flex', alignItems: 'center', gap: 32, textAlign: 'right' }}>
                      <div>
                         <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>{dropRate}</div>
                         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>drop rate</div>
                      </div>
                      <div>
                         <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{usersLost}</div>
                         <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>users lost</div>
                      </div>
                      <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(92,111,255,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(92,111,255,0.3)' }} onClick={(e) => { e.stopPropagation(); setReplayAlert(alert); }}>
                         ▶ Replay
                      </button>
                      <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }} onClick={(e) => { e.stopPropagation(); toggleExpand(alert.id); }}>
                         <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>➔</span> Fix
                      </button>
                   </div>
                </div>

                {/* Expanded Analysis & Code Fix Area */}
                {isExpanded && insight && (
                  <div style={{ padding: '0 24px 28px 24px', borderTop: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 18px' }}>
                       <h3 style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                          🛠️ AI Root Cause &amp; Developer Fix
                       </h3>
                       {!alert.read && (
                          <button
                            className="primary-button"
                            style={{ background: 'var(--success)', padding: '6px 14px', fontSize: 13 }}
                            onClick={() => onMarkRead(alert.id)}
                          >
                            Mark as Fixed
                          </button>
                       )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column: evidence + user report + impact */}
                        <div className="col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Data Evidence */}
                            <div className="glass-panel" style={{ padding: 14, background: 'var(--bg-app)', border: '1px solid var(--border-medium)' }}>
                                <h5 style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Data Evidence</h5>
                                <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}>{insight.evidence}</p>
                            </div>

                            {/* User Reported Card — shown only when user typed a reason */}
                            {insight.userTypedReason && (
                              <div className="glass-panel animate-fade-in" style={{ padding: 14, background: 'rgba(92,111,255,0.08)', border: '1px solid rgba(92,111,255,0.25)' }}>
                                <h5 style={{ fontSize: 11, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                  ✍️ User Reported
                                </h5>
                                {/* Screenshot thumbnail */}
                                {insight.screenshotBase64 && (
                                  <div style={{ marginBottom: 10 }}>
                                    <img
                                      src={insight.screenshotBase64}
                                      alt="User screenshot"
                                      style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}
                                    />
                                    <div style={{ fontSize: 10, color: 'var(--success)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      📸 Screenshot attached
                                    </div>
                                  </div>
                                )}
                                <p style={{ fontSize: 13, margin: '0 0 8px', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                  "{insight.userTypedReason}"
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(92,111,255,0.2)', color: 'var(--accent-primary)' }}>
                                    {insight.categoryLabel}
                                  </span>
                                  {insight.resolvedIntentCategory && insight.resolvedIntentCategory !== insight.reasonCategory && (
                                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(245,158,11,0.2)', color: 'var(--warning)' }}>
                                      ⚡ AI resolved to: {insight.resolvedIntentCategory}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Impact Prediction */}
                            <div className="glass-panel" style={{ padding: 14, background: 'var(--success-bg)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <h5 style={{ fontSize: 11, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Predicted Impact</h5>
                                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)', margin: 0 }}>{insight.recommendation.impact_prediction}</p>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>recovery if fix applied</p>
                            </div>
                        </div>

                        {/* Right column: code patch */}
                        <div className="col-span-2">
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                              {insight.recommendation.userContext
                                ? <>Code generated from: <em style={{ color: 'var(--text-primary)' }}>"{insight.recommendation.userContext.slice(0, 80)}{insight.recommendation.userContext.length > 80 ? '…' : ''}"</em></>
                                : 'Copy and paste this snippet directly into your codebase to resolve the root cause.'
                              }
                            </p>
                            {insight.recommendation.generatedCode && (
                                <CodePatchRenderer
                                  code={insight.recommendation.generatedCode}
                                  userContext={insight.recommendation.userContext}
                                  screenshotBase64={insight.screenshotBase64}
                                  imageAttached={insight.recommendation.imageAttached}
                                />
                            )}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rendering the Session Replay Simulator mapped to the selected alert */}
      <SessionReplayModal 
        isOpen={!!replayAlert} 
        alert={replayAlert || {}} 
        onClose={() => setReplayAlert(null)} 
      />
    </div>
  );
};
