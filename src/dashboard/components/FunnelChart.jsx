import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const FunnelChart = ({ metrics }) => {
  const data = Object.keys(metrics).map(key => ({
    name: metrics[key].name,
    entered: metrics[key].entered,
    completed: metrics[key].completed,
    dropRate: ((metrics[key].dropped / metrics[key].entered) * 100).toFixed(1)
  }));

  return (
    <div className="glass-panel p-6" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: 16 }}>Signup Funnel Conversion</h3>
      <div style={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEntered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ background: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <Area type="monotone" dataKey="entered" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEntered)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-4" style={{ justifyContent: 'space-around' }}>
        {data.map(d => (
          <div key={d.name} className="flex-col items-center p-4 glass-panel" style={{ flex: 1 }}>
            <div className="text-secondary text-sm">{d.name}</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{d.entered}</div>
            <div className={`text-sm ${d.dropRate > 15 ? 'text-danger' : 'text-success'}`}>
              {d.dropRate}% Drop-off
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
