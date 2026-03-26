import React, { useState, useMemo } from 'react';

const FlowColumn = ({ flow, metrics, label, color }) => {
  if (!flow) return <div style={{ flex: 1, padding: 24, border: '1px dashed var(--border-light)', borderRadius: 12, textAlign: 'center', color: 'var(--text-muted)' }}>Select {label}</div>;

  const flowSteps = flow.steps.map(stepId => ({
    id: stepId,
    ...metrics[stepId]
  })).filter(s => s && s.entered); // Only show tracked steps

  const totalEntered = flowSteps.length > 0 ? flowSteps[0].entered : 0;
  const finalStep = flowSteps.length > 0 ? flowSteps[flowSteps.length - 1] : null;
  const completedCount = finalStep ? (finalStep.entered - finalStep.dropped) : 0;
  const overallConv = totalEntered > 0 ? Math.round((completedCount / totalEntered) * 100) : 0;

  return (
    <div style={{ flex: 1, background: `rgba(${color}, 0.05)`, border: `1px solid rgba(${color}, 0.2)`, borderRadius: 12, padding: 24 }}>
      <h3 style={{ margin: '0 0 16px', color: `rgb(${color})`, fontSize: 20 }}>{label}: {flow.name}</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
         <div className="glass-panel" style={{ flex: 1, padding: 16 }}>
             <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Overall Conv.</p>
             <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>{overallConv}%</p>
         </div>
         <div className="glass-panel" style={{ flex: 1, padding: 16 }}>
             <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Users Tested</p>
             <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>{totalEntered}</p>
         </div>
      </div>
      <div>
        <h4 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Step Drop-offs</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {flowSteps.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No data for this flow yet.</p> : flowSteps.map((s, i) => {
             const dropRate = s.entered > 0 ? Math.round((s.dropped / s.entered) * 100) : 0;
             return (
               <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                 <span style={{ fontSize: 13 }}>{i+1}. {s.name}</span>
                 <span style={{ fontSize: 13, fontWeight: 600, color: dropRate > 20 ? 'var(--danger)' : 'var(--text-primary)' }}>{dropRate}% drop</span>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export const ABTestingPanel = ({ metrics, flows }) => {
  const flowKeys = Object.keys(flows);
  const [flowA, setFlowA] = useState(flowKeys[0] || '');
  const [flowB, setFlowB] = useState(flowKeys[1] || '');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
       <div style={{ marginBottom: 32 }}>
           <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>A/B Testing & Comparison</h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Compare two sign-up flows side-by-side to identify the highest performing funnel.</p>
       </div>

       <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1 }}>
             <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Select Variant A</label>
             <select className="glass-input" style={{ width: '100%', padding: '10px 14px' }} value={flowA} onChange={e => setFlowA(e.target.value)}>
                <option value="">Select a flow...</option>
                {Object.entries(flows).map(([k, f]) => <option key={k} value={k}>{f.name}</option>)}
             </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 10, fontSize: 24, color: 'var(--text-muted)', fontWeight: 800 }}>VS</div>
          <div style={{ flex: 1 }}>
             <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Select Variant B</label>
             <select className="glass-input" style={{ width: '100%', padding: '10px 14px' }} value={flowB} onChange={e => setFlowB(e.target.value)}>
                <option value="">Select a flow...</option>
                {Object.entries(flows).map(([k, f]) => <option key={k} value={k}>{f.name}</option>)}
             </select>
          </div>
       </div>

       <div style={{ display: 'flex', gap: 24 }}>
          <FlowColumn flow={flows[flowA]} metrics={metrics} label="Variant A" color="92, 111, 255" />
          <FlowColumn flow={flows[flowB]} metrics={metrics} label="Variant B" color="16, 185, 129" />
       </div>
    </div>
  );
};
