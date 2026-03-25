import React, { useState, useRef } from 'react';

const REASON_CATEGORIES = [
  {
    id: 'layout',
    icon: '📐',
    label: 'Placement / Layout',
    desc: 'Something is in the wrong place or hard to find',
    color: '#f59e0b',
    reasons: [
      'The button/CTA is hard to spot',
      'The form fields are in a confusing order',
      'Important info is hidden or below the fold',
      'The page looks broken or misaligned',
    ]
  },
  {
    id: 'copy',
    icon: '📝',
    label: 'Confusing Text / Copy',
    desc: 'Labels, instructions, or error messages are unclear',
    color: '#6366f1',
    reasons: [
      'I don\'t understand what is being asked',
      'The error message doesn\'t explain what went wrong',
      'Legal/terms text is too long or intimidating',
      'Field label is ambiguous',
    ]
  },
  {
    id: 'trust',
    icon: '🔒',
    label: 'Trust / Privacy Concern',
    desc: 'The step asks for something sensitive without explanation',
    color: '#ef4444',
    reasons: [
      'I don\'t know why this data is needed',
      'No explanation of how my data will be used',
      'SSN / ID upload feels risky without context',
      'No security badge or trust signal visible',
    ]
  },
  {
    id: 'performance',
    icon: '⏱️',
    label: 'Slow / Technical Error',
    desc: 'The page is slow, freezing, or erroring',
    color: '#10b981',
    reasons: [
      'Page took too long to load',
      'The submit button did nothing / no feedback',
      'I hit a validation error but can\'t tell what\'s wrong',
      'The page crashed or showed an error screen',
    ]
  },
  {
    id: 'complexity',
    icon: '🤯',
    label: 'Too Complex / Too Many Steps',
    desc: 'The flow feels overwhelming or asks for too much',
    color: '#8b5cf6',
    reasons: [
      'There are too many required fields',
      'I don\'t have the required document right now',
      'The step requires information I need to look up',
      'I didn\'t expect this step to be here',
    ]
  },
];

const MIN_REASON_LENGTH = 10;

export const DropOffReasonModal = ({ stepName, flowName, onSubmit, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [userTypedReason, setUserTypedReason] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const category = REASON_CATEGORIES.find(c => c.id === selectedCategory);
  const isReasonValid = userTypedReason.trim().length >= MIN_REASON_LENGTH;
  const canSubmit = selectedCategory && isReasonValid;

  const processImageFile = (file) => {
    setImageError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBase64(e.target.result);
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      category: selectedCategory,
      reason: selectedReason || category.label,
      categoryLabel: category.label,
      userTypedReason: userTypedReason.trim(),
      imageBase64: imageBase64 || null,
      step: stepName,
      flow: flowName,
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: 660, maxHeight: '92vh', overflowY: 'auto',
        padding: 32, borderColor: 'var(--border-medium)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🛑</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Why are you dropping off?</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            At <strong style={{ color: '#fff' }}>{stepName}</strong> in <strong style={{ color: 'var(--accent-primary)' }}>{flowName}</strong>.
            Your description trains the AI to generate an <em>exact</em>, non-generic code fix.
          </p>
        </div>

        {/* Category Picker */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {REASON_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedReason(null); }}
              style={{
                background: selectedCategory === cat.id
                  ? `rgba(${hexToRgb(cat.color)}, 0.15)`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedCategory === cat.id ? cat.color : 'var(--border-light)'}`,
                borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 3
              }}
            >
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{
                fontWeight: 600, fontSize: 13,
                color: selectedCategory === cat.id ? cat.color : 'var(--text-primary)'
              }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{cat.desc}</span>
            </button>
          ))}
        </div>

        {/* Quick Reason Chips */}
        {category && (
          <div className="animate-fade-in" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Quick select (optional)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {category.reasons.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedReason(r);
                    if (userTypedReason.trim().length < MIN_REASON_LENGTH) {
                      setUserTypedReason(r);
                    }
                  }}
                  style={{
                    background: selectedReason === r ? `rgba(${hexToRgb(category.color)}, 0.1)` : 'transparent',
                    border: `1px solid ${selectedReason === r ? category.color : 'var(--border-light)'}`,
                    borderRadius: 8, padding: '9px 14px', cursor: 'pointer',
                    textAlign: 'left', color: selectedReason === r ? category.color : 'var(--text-secondary)',
                    fontSize: 13, transition: 'all 0.15s', fontWeight: selectedReason === r ? 600 : 400
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Required: Typed Reason */}
        {selectedCategory && (
          <div className="animate-fade-in" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: isReasonValid ? 'var(--success)' : category?.color || 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                {isReasonValid ? '✅' : '✍️'} Describe exactly what happened
                <span style={{ color: 'var(--danger)', fontSize: 14 }}>*</span>
              </label>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: isReasonValid ? 'var(--success)' : userTypedReason.length === 0 ? 'var(--text-muted)' : 'var(--warning)'
              }}>
                {userTypedReason.length} / {MIN_REASON_LENGTH} min chars
              </span>
            </div>
            <textarea
              className="glass-input"
              value={userTypedReason}
              onChange={e => setUserTypedReason(e.target.value)}
              placeholder={`Tell the AI specifically what you experienced at the "${stepName}" step. The more specific, the more targeted the generated code fix will be.\n\nExample: "The submit button showed a spinner that never resolved — I waited 20 seconds and nothing happened."`}
              style={{
                width: '100%', minHeight: 110, resize: 'vertical', fontSize: 13,
                boxSizing: 'border-box',
                border: `1px solid ${isReasonValid ? 'rgba(16,185,129,0.5)' : userTypedReason.length > 0 ? 'rgba(245,158,11,0.4)' : 'var(--border-light)'}`,
                transition: 'border-color 0.2s'
              }}
            />
            {!isReasonValid && userTypedReason.length > 0 && (
              <p style={{ fontSize: 11, color: 'var(--warning)', marginTop: 4, margin: '4px 0 0' }}>
                ⚠️ Please describe in a bit more detail — this helps the AI generate a precise fix.
              </p>
            )}
          </div>
        )}

        {/* Screenshot Upload */}
        {selectedCategory && (
          <div className="animate-fade-in" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
              📸 Attach a screenshot (optional — helps AI understand context)
            </label>

            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview}
                  alt="Attached screenshot"
                  style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 10, border: '1px solid var(--border-medium)', objectFit: 'contain', background: '#0a0a0f' }}
                />
                <button
                  onClick={() => { setImageBase64(null); setImagePreview(null); setImageError(null); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{
                    position: 'absolute', top: -8, right: -8, width: 24, height: 24,
                    borderRadius: '50%', background: 'var(--danger)', border: 'none',
                    color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}
                >✕</button>
                <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ✅ Screenshot attached — AI will annotate the fix with this context
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                  borderRadius: 10, padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                  background: isDragging ? 'rgba(92,111,255,0.06)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Click to upload or drag & drop a screenshot
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
                  PNG, JPG, WEBP — up to 5MB
                </p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFilePick} />
            {imageError && (
              <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6, margin: '6px 0 0' }}>⚠️ {imageError}</p>
            )}
          </div>
        )}

        {/* AI context preview */}
        {canSubmit && (
          <div className="animate-fade-in" style={{
            marginBottom: 20, padding: '12px 16px',
            background: 'rgba(92,111,255,0.08)', border: '1px solid rgba(92,111,255,0.25)', borderRadius: 10
          }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 4 }}>
              🤖 AI will generate a fix based on:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <li>Step: <strong style={{ color: '#fff' }}>{stepName}</strong></li>
              <li>Category: <strong style={{ color: '#fff' }}>{category?.label}</strong></li>
              <li>Your reason: <em style={{ color: 'var(--text-primary)' }}>"{userTypedReason.trim().slice(0, 80)}{userTypedReason.length > 80 ? '…' : ''}"</em></li>
              {imageBase64 && <li>Screenshot: <strong style={{ color: 'var(--success)' }}>✅ attached</strong></li>}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="primary-button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              flex: 1, height: 50, opacity: canSubmit ? 1 : 0.35,
              background: canSubmit ? (category ? category.color : 'var(--accent-primary)') : 'var(--border-medium)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontSize: 15, fontWeight: 700, transition: 'all 0.2s'
            }}
          >
            {canSubmit ? '🤖 Submit & Generate Exact AI Fix' : `✍️ Describe the issue first (${Math.max(0, MIN_REASON_LENGTH - userTypedReason.length)} more chars)`}
          </button>
          <button className="secondary-button" onClick={onCancel} style={{ height: 50, padding: '0 20px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper to convert hex to r,g,b for rgba usage
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
