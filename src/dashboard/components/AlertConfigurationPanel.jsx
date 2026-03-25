import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';

export const AlertConfigurationPanel = ({ rules }) => {
  const [localRules, setLocalRules] = useState([]);

  useEffect(() => {
    setLocalRules(rules || []);
  }, [rules]);

  const handleToggle = (id) => {
    const updated = localRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setLocalRules(updated);
    mockApi.updateRules(updated);
  };

  const handleThresholdChange = (id, newThreshold) => {
    const updated = localRules.map(r => r.id === id ? { ...r, threshold: Number(newThreshold) } : r);
    setLocalRules(updated);
    // Debounce this in a prod app, but for MVP it's OK to save on blur
    mockApi.updateRules(updated);
  };

  if (localRules.length === 0) return null;

  return (
    <div className="glass-panel p-6" style={{ flex: 1, marginTop: '24px' }}>
      <h3 className="mb-4">⚙️ Alert Configuration</h3>
      <p className="text-sm text-secondary mb-4">Set thresholds to define when developer alerts trigger and where they get sent.</p>
      
      <div className="flex-col gap-4">
        {localRules.map(rule => (
          <div key={rule.id} style={{ 
            padding: '16px', 
            borderRadius: '8px', 
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-light)'
          }}>
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h4 style={{ margin: 0 }}>{rule.name}</h4>
                 <div className="text-sm text-secondary">Channel: {rule.channel}</div>
               </div>
               <div>
                  <button 
                    onClick={() => handleToggle(rule.id)}
                    className="primary-button" 
                    style={{ 
                      padding: '4px 12px', 
                      background: rule.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: rule.enabled ? '#10b981' : 'white',
                      border: 'none'
                    }}
                  >
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm">Trigger when drop-off exceeds:</span>
                <input 
                  type="number" 
                  className="glass-input" 
                  style={{ width: '80px', padding: '4px 8px' }}
                  value={rule.threshold}
                  onChange={(e) => setLocalRules(localRules.map(r => r.id === rule.id ? { ...r, threshold: e.target.value } : r))}
                  onBlur={(e) => handleThresholdChange(rule.id, e.target.value)}
                />
                <span className="text-sm">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
