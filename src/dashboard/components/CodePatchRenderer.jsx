import React, { useState } from 'react';

export const CodePatchRenderer = ({ code, userContext, screenshotBase64, imageAttached }) => {
  const [copied, setCopied] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>

      {/* User context callout — shown only when we have verbatim reason */}
      {userContext && (
        <div style={{
          background: 'rgba(92,111,255,0.12)', borderBottom: '1px solid rgba(92,111,255,0.2)',
          padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 10
        }}>
          {/* Screenshot thumbnail */}
          {screenshotBase64 && (
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={screenshotBase64}
                alt="User screenshot"
                onClick={() => setShowScreenshot(true)}
                style={{
                  width: 52, height: 40, objectFit: 'cover', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'zoom-in', flexShrink: 0
                }}
              />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)', borderRadius: 6, opacity: 0,
                transition: 'opacity 0.15s', fontSize: 14, pointerEvents: 'none'
              }}
                className="screenshot-hover-overlay"
              >🔍</div>
            </div>
          )}
          {imageAttached && !screenshotBase64 && (
            <span style={{ fontSize: 22, flexShrink: 0 }}>📸</span>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 3 }}>
              🤖 Generated from user-reported context
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
              "{userContext}"
            </p>
          </div>
        </div>
      )}

      {/* Code block header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px', background: '#252526', borderBottom: '1px solid #333'
      }}>
        <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>
          ✨ AI Suggested Fix — Copy & Paste into your codebase
        </span>
        <button
          onClick={handleCopy}
          className="secondary-button text-xs"
          style={{ padding: '4px 10px', borderColor: copied ? 'var(--success)' : 'var(--border-light)', fontSize: 12 }}
        >
          {copied ? '✅ Copied!' : '📋 Copy Code'}
        </button>
      </div>

      {/* Code */}
      <pre style={{ padding: '16px', fontSize: '12px', overflowX: 'auto', color: '#d4d4d4', margin: 0, background: '#1e1e1e', lineHeight: 1.6 }}>
        <code>{code}</code>
      </pre>

      {/* Screenshot lightbox */}
      {showScreenshot && screenshotBase64 && (
        <div
          onClick={() => setShowScreenshot(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative' }}>
            <img src={screenshotBase64} alt="User screenshot" style={{ maxWidth: '85vw', maxHeight: '80vh', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', top: -36, right: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              Click anywhere to close
            </div>
            <div style={{ marginTop: 12, textAlign: 'center', background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{userContext}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
