import React, { useEffect, useState } from 'react';

export const SessionReplayModal = ({ isOpen, onClose, alert }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
        setIsPlaying(true);
        const timer = setTimeout(() => setIsPlaying(false), 8000);
        return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
      }}
    >
       <div className="glass-panel" style={{ width: 900, height: 600, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', background: '#111', borderBottom: '1px solid var(--border-light)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ display: 'flex', gap: 6 }}>
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                     <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                 </div>
                 <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Session Replay: User #89284 • <span className="text-danger">Dropped off at {alert.stepId}</span></div>
             </div>
             <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>

          {/* Replay Area */}
          <div style={{ flex: 1, position: 'relative', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             
             {/* Fake App UI */}
             <div style={{ width: 500, height: 350, background: '#fff', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                 <div style={{ width: '40%', height: 24, background: '#f3f4f6', borderRadius: 4 }} />
                 <div style={{ width: '100%', height: 40, border: '1px solid #d1d5db', borderRadius: 4 }} />
                 <div style={{ width: '100%', height: 40, border: '1px solid #d1d5db', borderRadius: 4 }} />
                 
                 {/* The "broken" button that causes rage clicks */}
                 <button className={isPlaying ? 'rage-shake' : ''} style={{ marginTop: 'auto', width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
                    Continue Checkout
                 </button>

                 {/* Simulated Cursor */}
                 {isPlaying && (
                     <div 
                        className="cursor-play"
                        style={{
                            position: 'absolute',
                            width: 20, height: 20,
                            background: 'url("data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'24\\\' height=\\\'24\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'black\\\'><path d=\\\'M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 5z\\\'/></svg>") no-repeat',
                            zIndex: 10,
                            pointerEvents: 'none'
                        }} 
                     />
                 )}
                 {isPlaying && (
                     <div className="click-ripple" style={{ position: 'absolute', bottom: 45, left: '50%', transform: 'translateX(-50%)' }} />
                 )}
             </div>

          </div>

          {/* Player Controls */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', background: '#111', borderTop: '1px solid var(--border-light)', gap: 16 }}>
             <button onClick={() => setIsPlaying(true)} style={{ background: 'var(--accent-primary)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                ▶
             </button>
             <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                 <div style={{ width: isPlaying ? '100%' : '0%', height: '100%', background: 'var(--accent-primary)', borderRadius: 2, transition: isPlaying ? 'width 8s linear' : 'none' }}></div>
             </div>
             <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>00:08 / 00:08</div>
          </div>
       </div>

       <style>{`
          @keyframes cursorMove {
             0% { top: 20%; left: 80%; }
             30% { top: 40%; left: 20%; }
             60% { top: 60%; left: 50%; }
             80% { top: 80%; left: 50%; }
             85% { top: 80%; left: 50%; transform: scale(0.9); }
             90% { top: 80%; left: 50%; transform: scale(1); }
             100% { top: 80%; left: 50%; }
          }
          .cursor-play {
             animation: cursorMove 8s ease forwards;
          }
          @keyframes ripple {
             0% { width: 0; height: 0; opacity: 0.5; }
             100% { width: 60px; height: 60px; opacity: 0; }
          }
          .click-ripple {
             position: absolute;
             border-radius: 50%;
             background: rgba(255, 0, 0, 0.4);
             animation: ripple 0.5s ease-out 5;
             animation-delay: 6s;
          }
          @keyframes shake {
             0%, 100% { transform: translateX(0); }
             25% { transform: translateX(-5px); }
             75% { transform: translateX(5px); }
          }
          .rage-shake {
             animation: shake 0.2s ease-in-out 5;
             animation-delay: 6s;
          }
       `}</style>
    </div>
  );
};
