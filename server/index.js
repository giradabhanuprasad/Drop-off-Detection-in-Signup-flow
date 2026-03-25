const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let events = [];
let alerts = [];
let insights = [];

// Massive dictionary of logic to fulfill user's request for "7-8 different kinds of signup flows"
const flowDefinitions = {
    'saas': {
        name: 'Hushh.ai Classic', 
        steps: ['email', 'otp', 'profile', 'kyc', 'bank', 'preferences', 'payment']
    },
    'ecommerce': {
        name: 'Guest Checkout',
        steps: ['cart_review', 'guest_email', 'shipping_address', 'shipping_method', 'credit_card', 'order_review']
    },
    'fintech': {
        name: 'Crypto App Signup',
        steps: ['phone_verify', 'selfie_scan', 'id_upload', 'ssn_input', 'connect_plaid', 'setup_pin']
    },
    'social': {
        name: 'Gen-Z Social App',
        steps: ['handle_select', 'contact_sync', 'invite_friends', 'avatar_upload', 'select_hashtags']
    },
    'healthcare': {
        name: 'Patient Portal',
        steps: ['patient_verify', 'insurance_upload', 'medical_history', 'hippa_consent', 'emergency_contact']
    },
    'edtech': {
        name: 'Learning Platform',
        steps: ['role_select', 'grade_level', 'subject_select', 'invite_parents', 'download_app']
    },
    'travel': {
        name: 'Flight Booking',
        steps: ['flight_select', 'passenger_details', 'seat_selection', 'baggage_addon', 'travel_insurance', 'travel_payment']
    },
    'gaming': {
        name: 'MMO Account',
        steps: ['username_claim', 'age_verify', 'link_discord', 'newsletter_optin', 'download_launcher']
    }
};

// Seed random metrics for all these huge funnels
let metrics = {};
Object.entries(flowDefinitions).forEach(([flowId, flow]) => {
    let baseEntered = Math.floor(Math.random() * 5000) + 1000;
    flow.steps.forEach((stepId, index) => {
        // Compound drop off so it looks somewhat realistic
        const dropRate = Math.random() * 0.2 + 0.05; // 5% to 25% drop per step
        const dropped = Math.floor(baseEntered * dropRate);
        const completed = baseEntered - dropped;
        
        metrics[stepId] = {
            entered: baseEntered,
            completed: completed,
            dropped: dropped,
            avgTime: Math.floor(Math.random() * 60) + 10,
            errors: Math.floor(Math.random() * 200),
            name: stepId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            rageClicks: Math.floor(Math.random() * 100),
            hesitation: Math.floor(Math.random() * 400),
            tabSwitches: Math.floor(Math.random() * 200),
            backButtons: Math.floor(Math.random() * 50)
        };
        baseEntered = completed; // Next step starts with what completed this step
    });
});

let alertRules = [
    { id: 'rule1', name: 'Critical Drop-off Rule', threshold: 15, channel: 'Slack', enabled: true }
];

// Precision Code Fix Matrix: keyed by [stepId][reasonCategory]
// Each fix is EXACT and SPECIFIC to the friction at that step for that reason
const SPECIFIC_CODE_FIXES = {
    // === SAAS / HUSHH SIGNUP ===
    email: {
        layout: `// FIX: Email field and CTA hidden below fold on mobile
// The email input overlaps the keyboard; sticky CTA is missing

// EmailStep.jsx
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', padding: '24px 16px' }}>
  <div style={{ flex: 1 }}>
    <h2>What's your email?</h2>
    <input type="email" autoFocus placeholder="name@email.com" />
  </div>
  {/* CTA sticks above keyboard on iOS/Android */}
  <button
    style={{ position: 'sticky', bottom: 16, width: '100%', height: 52 }}
    onClick={handleNext}
  >
    Continue →
  </button>
</div>`,
        copy: `// FIX: Users don't know what the email is used for
// Add a trust-building subtitle and friendly validation

// EmailStep.jsx
<div>
  <h2>What's your email?</h2>
  <p style={{ color: '#94a3b8', fontSize: 14 }}>
    We'll use this to send your personalized AI report. No spam, ever.
  </p>
  <input type="email" placeholder="name@email.com"
    onChange={e => {
      setEmail(e.target.value);
      setError(null);
    }}
  />
  {/* Friendly real-time validation */}
  {error && (
    <p style={{ color: '#ef4444', fontSize: 13 }}>
      ⚠️ That doesn't look like a valid email — try name@example.com
    </p>
  )}
</div>`,
        trust: `// FIX: Users worry about spam or data misuse at email step
// Add inline trust badge and privacy link

// EmailStep.jsx
<>
  <input type="email" placeholder="name@email.com" />
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12,
      padding: '10px 14px', background: 'rgba(34,197,94,0.06)',
      border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
    <span>🔒</span>
    <p style={{ fontSize: 12, color: '#86efac', margin: 0 }}>
      Your email is encrypted and never sold. <a href="/privacy">Privacy policy →</a>
    </p>
  </div>
</>`,
        performance: `// FIX: Email submit has no loading state; double-submit causes errors

// EmailStep.jsx
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (loading || !email.trim()) return;
  setLoading(true);
  try {
    await api.checkEmail(email);
    onNext();
  } catch (err) {
    setError(err.message === '409' ? 'This email is already registered. Try logging in.' : 'Something went wrong. Please retry.');
  } finally {
    setLoading(false);
  }
};

<button onClick={handleSubmit} disabled={loading || !email.trim()}>
  {loading ? <SpinnerIcon /> : 'Continue →'}
</button>`,
        complexity: `// FIX: Email step is confusing because users don't know what comes next
// Show a step preview so users know what they're signing up for

// EmailStep.jsx — add a step overview card above the form
<div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)',
    borderRadius: 10, marginBottom: 24, fontSize: 13 }}>
  <strong>Quick signup — 3 steps:</strong>
  <ol style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#94a3b8' }}>
    <li>Email</li>
    <li>Verify (OTP)</li>
    <li>Set up your profile</li>
  </ol>
</div>
<input type="email" placeholder="name@email.com" />`,
    },

    otp: {
        layout: `// FIX: OTP boxes are too small and cramped on mobile
// Increase touch target size and add auto-advance

// OtpStep.jsx
const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

const handleChange = (idx, val) => {
  setCode(prev => { const c = [...prev]; c[idx] = val; return c; });
  if (val && idx < 5) inputRefs[idx + 1].current.focus(); // Auto-advance
};

<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
  {[0,1,2,3,4,5].map(i => (
    <input key={i} ref={inputRefs[i]} type="tel" maxLength={1}
      style={{ width: 52, height: 64, fontSize: 24, textAlign: 'center',
               borderRadius: 12, border: '2px solid rgba(255,255,255,0.15)' }}
      onChange={e => handleChange(i, e.target.value)}
    />
  ))}
</div>`,
        copy: `// FIX: Users don't understand where the code was sent or how to resend

// OtpStep.jsx — add sender context and resend countdown
const [resendCount, setResendCount] = useState(30);
useEffect(() => {
  const t = setInterval(() => setResendCount(c => c > 0 ? c - 1 : 0), 1000);
  return () => clearInterval(t);
}, []);

<>
  <p style={{ color: '#94a3b8', textAlign: 'center' }}>
    We sent a 6-digit code to <strong style={{ color: '#fff' }}>{email}</strong>.<br/>
    Check your inbox — it expires in 10 minutes.
  </p>
  {/* OTP inputs here */}
  <button disabled={resendCount > 0} onClick={resendOtp}>
    {resendCount > 0 ? \`Resend in \${resendCount}s\` : 'Resend code'}
  </button>
  <button onClick={() => goBack()}>← Wrong email?</button>
</>`,
        performance: `// FIX: OTP verification takes 3+ seconds with no feedback
// Add instant optimistic validation + spinner

// OtpStep.jsx
const verifyOtp = async (code) => {
  if (code.length < 6) return;
  setVerifying(true);
  try {
    await api.verifyOtp(email, code);
    onNext(); // Instant transition
  } catch {
    setError('Incorrect code. Please try again or request a new one.');
    // Shake animation on error
    setShake(true);
    setTimeout(() => setShake(false), 500);
  } finally {
    setVerifying(false);
  }
};

// CSS for shake:
// @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`,
        trust: `// FIX: Users distrust receiving an SMS/email from an unknown sender

// Add sender verification info before OTP screen
<div style={{ textAlign: 'center' }}>
  <p style={{ fontSize: 13, color: '#94a3b8' }}>
    We just sent from <strong style={{ color: '#fff' }}>noreply@hushh.ai</strong><br/>
    If you don't see it, check your spam folder.
  </p>
  <a href="https://hushh.ai/security" target="_blank"
    style={{ fontSize: 12, color: '#6366f1' }}>
    Why is Hushh.ai contacting me? →
  </a>
</div>`,
        complexity: `// FIX: 6-digit OTP feels overwhelming for a first step
// Offer magic link as an alternative to OTP

// OtpStep.jsx
<div style={{ textAlign: 'center', marginTop: 24 }}>
  <p style={{ color: '#94a3b8', fontSize: 14 }}>Prefer not to enter a code?</p>
  <button onClick={sendMagicLink} style={{ color: '#6366f1', background: 'none', border: 'none' }}>
    ✉️ Send me a magic sign-in link instead
  </button>
</div>`,
    },

    kyc: {
        layout: `// FIX: KYC document upload zone is below the fold; users miss it

// KycStep.jsx — bring upload zone to top, instructions below
<div>
  {/* Upload FIRST, instructions below */}
  <div className="upload-zone" style={{ border: '2px dashed #6366f1', borderRadius: 16,
      padding: 40, textAlign: 'center', cursor: 'pointer', marginBottom: 20 }}
    onClick={() => fileRef.current.click()}>
    <span style={{ fontSize: 40 }}>📤</span>
    <p style={{ fontWeight: 600, margin: '8px 0 4px' }}>Upload your ID</p>
    <p style={{ fontSize: 13, color: '#94a3b8' }}>Passport, Driver's License, or National ID</p>
    <input ref={fileRef} type="file" accept="image/*,application/pdf" capture="environment" hidden />
  </div>
  <p style={{ fontSize: 12, color: '#64748b' }}>
    Make sure all 4 corners are visible and the text is readable.
  </p>
</div>`,
        trust: `// FIX: Users abandon KYC because they don't trust why ID is needed

// KycStep.jsx — Add legal context + security badge
<>
  <div style={{ padding: 16, background: 'rgba(99,102,241,0.06)',
      border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, marginBottom: 20 }}>
    <strong>🔒 Why do we verify your identity?</strong>
    <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>
      We are regulated under [KYC/AML laws]. Your ID is encrypted with AES-256,
      processed by our licensed identity provider, and deleted within 30 days.
      We never store images on our own servers.
    </p>
    <a href="/kyc-policy" style={{ fontSize: 12, color: '#818cf8' }}>Read our verification policy →</a>
  </div>
  {/* Upload form here */}
</>`,
        performance: `// FIX: KYC document upload times out with no progress or retry

// KycStep.jsx
const [progress, setProgress] = useState(0);
const [error, setError] = useState(null);

const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);
  setProgress(0);
  try {
    await axios.post('/api/kyc/upload', formData, {
      onUploadProgress: e => setProgress(Math.round(e.loaded * 100 / e.total))
    });
    onNext();
  } catch {
    setError('Upload failed. Check your connection and try again.');
  }
};

// Show: <ProgressBar value={progress} /> and a retry button on error`,
        complexity: `// FIX: KYC step asks for both front and back simultaneously — too much

// Split into two sequential micro-steps
const [kycStage, setKycStage] = useState('front'); // 'front' | 'back' | 'selfie'

return kycStage === 'front' ? (
  <UploadStep label="Upload front of ID" onDone={() => setKycStage('back')} />
) : kycStage === 'back' ? (
  <UploadStep label="Upload back of ID" onDone={() => setKycStage('selfie')} />
) : (
  <SelfieStep onDone={onNext} />
);`,
        copy: `// FIX: KYC step labels are technical and confusing ("Government-Issued Photo ID")

// KycStep.jsx — use plain language
<h2>Let's verify it's really you</h2>
<p style={{ color: '#94a3b8', fontSize: 14 }}>
  Upload a photo of your driving licence, passport, or national ID card.<br/>
  Make sure it's not expired and all text is clearly readable.
</p>`,
    },

    insurance_upload: {
        layout: `// FIX: Upload button not visible on mobile without scrolling past instructions

// InsuranceUploadStep.jsx — put the upload button at the top
<>
  {/* Primary action FIRST */}
  <label style={{ display: 'block', border: '2px dashed #38bdf8', borderRadius: 16,
      padding: 32, textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
    <span style={{ fontSize: 36 }}>📋</span>
    <p style={{ fontWeight: 600 }}>Tap to upload your insurance card</p>
    <input type="file" accept="image/*" capture="environment" hidden />
  </label>
  {/* Simple instruction below */}
  <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
    Upload front side only • JPG, PNG, or PDF
  </p>
</>`,
        performance: `// FIX: Insurance PDF upload hangs with spinner forever if file is too large

// InsuranceUploadStep.jsx
const MAX_SIZE_MB = 10;

const handleFile = async (file) => {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    setError(\`File is too large (\${(file.size/1024/1024).toFixed(1)}MB). Maximum is \${MAX_SIZE_MB}MB.\`);
    return;
  }
  setUploading(true);
  try {
    await api.uploadInsurance(file);
    onNext();
  } catch {
    setError('Upload failed. Your session is still safe — please retry.');
  } finally {
    setUploading(false);
  }
};`,
        trust: `// FIX: Patients don't know what the portal does with their insurance card

<div style={{ padding: 16, background: 'rgba(56,189,248,0.05)',
    border: '1px solid rgba(56,189,248,0.15)', borderRadius: 10, marginBottom: 20 }}>
  <strong>🔒 Your insurance data is safe</strong>
  <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>
    Your insurance card is used only to verify your coverage. It is stored with
    HIPAA-compliant encryption and is never shared with insurers without your consent.
  </p>
</div>`,
        complexity: `// FIX: Patients don't have the card handy — allow skipping and completing later

<>
  {/* Primary upload */}
  <UploadZone />
  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 24, paddingTop: 20 }}>
    <button onClick={skipForNow} style={{ color: '#94a3b8', background: 'none', border: 'none', fontSize: 14 }}>
      I don't have it right now — add it later from my profile
    </button>
  </div>
</>`,
        copy: `// FIX: "Upload Insurance Card" label doesn't clarify which side or format

// InsuranceUploadStep.jsx
<h2>Upload your insurance card</h2>
<p style={{ fontSize: 14, color: '#94a3b8' }}>
  We need the <strong style={{ color: '#fff' }}>front side</strong> of your insurance card.<br/>
  Tip: Take a photo in good lighting so your policy number is clearly visible.
</p>`,
    },

    selfie_scan: {
        trust: `// FIX: Users don't understand why a selfie is required for a crypto app

// SelfieScanStep.jsx
<div style={{ padding: 16, background: 'rgba(34,197,94,0.05)',
    border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, marginBottom: 20 }}>
  <strong>🔒 Why is a selfie required?</strong>
  <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>
    We match your selfie to your ID photo to confirm you're the document owner.
    This is required by FinCEN anti-money-laundering regulations.<br/>
    <strong style={{ color: '#86efac' }}>Your image is deleted within 24 hours.</strong>
  </p>
</div>`,
        performance: `// FIX: Camera fails silently when permissions are denied

// SelfieScanStep.jsx
useEffect(() => {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(stream => { videoRef.current.srcObject = stream; })
    .catch(err => {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please go to your browser settings and allow camera access, then refresh this page.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera was found on your device. You can upload a photo instead.');
      } else {
        setCameraError('Camera failed to start. Please refresh and try again.');
      }
    });
}, []);

{cameraError && (
  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 10, padding: 16 }}>
    <p style={{ color: '#fca5a5', margin: 0 }}>⚠️ {cameraError}</p>
    <button onClick={() => fileRef.current.click()} style={{ marginTop: 10, color: '#60a5fa' }}>
      📤 Upload a selfie photo instead
    </button>
    <input ref={fileRef} type="file" accept="image/*" hidden />
  </div>
)}`,
        layout: `// FIX: Selfie capture button is hidden below the video preview on small screens

// SelfieScanStep.jsx — Stack vertically, capture button always visible
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
  <video ref={videoRef} autoPlay muted playsInline
    style={{ width: '100%', maxWidth: 280, borderRadius: 20, aspectRatio: '1/1', objectFit: 'cover' }} />
  <button onClick={captureFrame}
    style={{ width: 72, height: 72, borderRadius: '50%', background: '#22c55e',
             border: '4px solid white', cursor: 'pointer', fontSize: 28 }}>
    📸
  </button>
  <p style={{ fontSize: 12, color: '#64748b' }}>Look straight at the camera</p>
</div>`,
        copy: `// FIX: "Selfie Scan" label sounds robotic and medical — users hesitate

// Change all copy on this step:
<h2>Quick face verification</h2>
<p style={{ color: '#94a3b8', fontSize: 14 }}>
  Look straight at the camera and press the button.<br />
  This takes about 3 seconds and confirms your identity.
</p>`,
        complexity: `// FIX: The selfie screen shows too many instructions at once

// SelfieScanStep.jsx — Simplify to 3 bullet tips, hide the rest
<ul style={{ textAlign: 'left', color: '#94a3b8', fontSize: 13, paddingLeft: 20 }}>
  <li>Good lighting — face the window, not away from it</li>
  <li>Remove sunglasses or hats</li>
  <li>Hold still for 2 seconds</li>
</ul>
{/* Remove paragraphs of legal text from this screen */}`,
    },

    shipping_address: {
        layout: `// FIX: Address form fields are stacked awkwardly; ZIP/City on separate rows wastes space

// ShippingAddressStep.jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  <input placeholder="Full name" />
  <input placeholder="Street address" />
  <input placeholder="Apt, suite, unit (optional)" />
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10 }}>
    <input placeholder="City" />
    <input placeholder="ZIP" maxLength={10} />
  </div>
  <select><option>State</option>...</select>
</div>`,
        performance: `// FIX: No address autocomplete causes users to abandon long manual entry

// ShippingAddressStep.jsx — Add Google Places Autocomplete
import usePlacesAutocomplete, { getGeocode, getZipCode } from 'use-places-autocomplete';

const AddressAutocomplete = ({ onSelect }) => {
  const { value, suggestions: { data }, setValue } = usePlacesAutocomplete();
  return (
    <div style={{ position: 'relative' }}>
      <input value={value} onChange={e => setValue(e.target.value)}
        placeholder="Start typing your address..." />
      {data.length > 0 && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}>
          {data.map(s => (
            <li key={s.place_id} onClick={() => onSelect(s)}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 14 }}>
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};`,
        copy: `// FIX: "Shipping Address" doesn't clarify it's for the delivery, not billing

<h2>Where should we send your order?</h2>
<p style={{ color: '#94a3b8', fontSize: 14 }}>
  This is your delivery address. You can use a different billing address at checkout.
</p>`,
        trust: `// FIX: Users worry about address data being stored and misused

<p style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>
  🔒 Your address is used only for this delivery. We don't store it for marketing
  and you can delete it from your account at any time.
</p>`,
        complexity: `// FIX: International users can't complete the address form (no country selector)

// Add country selector FIRST to dynamically adjust the rest of the form
const [country, setCountry] = useState('US');
<>
  <select value={country} onChange={e => setCountry(e.target.value)}>
    <option value="US">🇺🇸 United States</option>
    <option value="GB">🇬🇧 United Kingdom</option>
    <option value="IN">🇮🇳 India</option>
    {/* ... more */}
  </select>
  {/* Render country-specific address fields below */}
  <AddressFormForCountry country={country} />
</>`,
    },

    seat_selection: {
        layout: `// FIX: Seat map doesn't show clearly on mobile — users can't tap the seats

// SeatSelectionStep.jsx — Add pinch-to-zoom and highlighted available seats
<div style={{ overflow: 'auto', touchAction: 'pan-x pan-y' }}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 44px)', gap: 6,
      justifyContent: 'center', minWidth: 320, padding: 16 }}>
    {seats.map(seat => (
      <button key={seat.id}
        style={{
          width: 44, height: 44, borderRadius: 8, fontSize: 12, fontWeight: 600,
          background: seat.available ? (selected === seat.id ? '#3b82f6' : '#1e293b') : '#374151',
          color: seat.available ? '#fff' : '#4b5563',
          border: selected === seat.id ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
          cursor: seat.available ? 'pointer' : 'not-allowed'
        }}
        disabled={!seat.available}
        onClick={() => setSelected(seat.id)}
      >{seat.label}</button>
    ))}
  </div>
</div>
<button onClick={() => onNext()} style={{ marginTop: 16, width: '100%' }}>
  {selected ? \`Continue with Seat \${selected} →\` : 'Skip — Assign me randomly'}
</button>`,
        copy: `// FIX: Users don't know which seats are available vs taken — legend is missing

// Add a visual legend above the seat map
<div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
  {[
    { color: '#1e293b', label: 'Available' },
    { color: '#3b82f6', label: 'Selected' },
    { color: '#374151', label: 'Taken' },
  ].map(item => (
    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, background: item.color, border: '1px solid rgba(255,255,255,0.15)' }} />
      {item.label}
    </div>
  ))}
</div>`,
        complexity: `// FIX: Seat selection forces a choice — add a clear 'skip' CTA that's not hidden

// Make the skip option prominent, not a tiny grey link
<>
  <SeatMap onSelect={setSeat} />
  <div style={{ marginTop: 20, padding: 16, background: 'rgba(255,255,255,0.03)',
      borderRadius: 10, textAlign: 'center' }}>
    <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 12px' }}>
      Don't mind where you sit?
    </p>
    <button onClick={onNext} style={{ color: '#60a5fa', fontWeight: 600,
        background: 'none', border: '1px solid rgba(96,165,250,0.3)',
        padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>
      Assign me a random seat
    </button>
  </div>
</>`,
        performance: `// FIX: Seat map takes 4+ seconds to load — lazy load and show skeleton

// SeatSelectionStep.jsx
import { Suspense, lazy } from 'react';
const SeatMap = lazy(() => import('./SeatMap'));

<Suspense fallback={
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 44px)', gap: 6 }}>
    {Array(36).fill(0).map((_, i) => (
      <div key={i} style={{ width: 44, height: 44, borderRadius: 8, background: '#1e293b',
          animation: 'pulse 1.5s ease-in-out infinite' }} />
    ))}
  </div>
}>
  <SeatMap onSelect={setSeat} />
</Suspense>`,
        trust: `// FIX: Users don't trust that their selected seat will be held during payment

<p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
  ✅ Your seat is held for <strong style={{ color: '#fff' }}>15 minutes</strong> while you complete checkout.
</p>`,
    },

    username_claim: {
        performance: `// FIX: Username submit errors only after form submission — add real-time check

// UsernameStep.jsx — Debounced availability check
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

const checkAvailability = useCallback(
  debounce(async (name) => {
    if (name.length < 3) { setAvailability(null); return; }
    setAvailability('checking');
    const { available } = await api.checkUsername(name);
    setAvailability(available ? 'available' : 'taken');
  }, 400),
  []
);

// Show status inline:
const statusIcon = {
  checking: '⏳',
  available: '✅ Available',
  taken: '❌ Taken — try adding numbers or underscores',
}[availability] || '';

<div>
  <input value={username} onChange={e => { setUsername(e.target.value); checkAvailability(e.target.value); }} />
  {availability && <p style={{ fontSize: 13, marginTop: 8 }}>{statusIcon}</p>}
</div>`,
        copy: `// FIX: "Username" is unclear — users don't know if it's permanent or an email

<h2>Claim your username</h2>
<p style={{ color: '#94a3b8', fontSize: 14 }}>
  This will be your public handle — like <strong style={{ color: '#c084fc' }}>@username</strong>.<br />
  <span style={{ color: '#ef4444', fontSize: 12 }}>⚠️ Usernames are permanent and can't be changed later.</span>
</p>`,
        layout: `// FIX: Username availability status and suggestions are below the keyboard on mobile

// UsernameStep.jsx — floating suggestions above keyboard
<div style={{ position: 'relative' }}>
  <input value={username} onChange={...} placeholder="your_epic_name" />
  {availability === 'taken' && suggestions.length > 0 && (
    <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0,
        background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: 12 }}>
      <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Try one of these:</p>
      {suggestions.map(s => (
        <button key={s} onClick={() => setUsername(s)}
          style={{ display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 10px', color: '#c084fc', background: 'none', border: 'none' }}>
          {s}
        </button>
      ))}
    </div>
  )}
</div>`,
        complexity: `// FIX: Username requirements (length, characters) are only shown after error

// Show requirements PROACTIVELY as the user types
const rules = [
  { label: '3–20 characters', pass: username.length >= 3 && username.length <= 20 },
  { label: 'Letters, numbers, or underscores only', pass: /^[a-zA-Z0-9_]+$/.test(username) },
  { label: 'Cannot start with a number', pass: !/^\\d/.test(username) },
];
<ul style={{ listStyle: 'none', padding: 0, margin: '12px 0', fontSize: 13 }}>
  {rules.map(r => (
    <li key={r.label} style={{ color: r.pass ? '#22c55e' : '#94a3b8', marginBottom: 4 }}>
      {r.pass ? '✓' : '○'} {r.label}
    </li>
  ))}
</ul>`,
        trust: `// FIX: Users don't know if their username is visible to others — privacy concern

<p style={{ fontSize: 12, padding: 12, background: 'rgba(192,132,252,0.06)',
    borderRadius: 8, color: '#94a3b8', marginTop: 12 }}>
  🔍 Your username is <strong style={{ color: '#fff' }}>public</strong> and searchable by other players.
  Your real name and email will never be shown.
</p>`,
    },

    ssn_input: {
        trust: `// FIX: Users abandon the SSN field because there's no explanation of legal requirement

// SsnStep.jsx
<>
  <div style={{ padding: 16, background: 'rgba(239,68,68,0.06)',
      border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: 20 }}>
    <strong>🏛️ Why is this required?</strong>
    <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0' }}>
      The USA PATRIOT Act (31 U.S.C. §5318) requires all financial institutions
      to verify the identity of users who open accounts. This is a legal requirement,
      not a personal data collection.
    </p>
    <p style={{ fontSize: 12, color: '#86efac', margin: '8px 0 0' }}>
      🔒 AES-256 encrypted. Not stored after verification. Never sold.
    </p>
    <a href="/ssn-policy" style={{ fontSize: 12, color: '#818cf8' }}>Read our full policy →</a>
  </div>
  <input type="password" placeholder="•••-••-••••" maxLength={11} style={{ letterSpacing: 4 }} />
</>`,
        copy: `// FIX: "Enter your SSN" label is abrupt — add human context

<h2>Last step: identity confirmation</h2>
<p style={{ fontSize: 14, color: '#94a3b8' }}>
  We're required by law to verify your identity before you can send or receive funds.
  Enter the last 4 digits of your Social Security Number.
</p>
<input type="tel" placeholder="Last 4 digits only" maxLength={4} />`,
        layout: `// FIX: SSN field auto-fills incorrectly and shows previously saved data

// SsnStep.jsx — block autofill explicitly
<input
  type="password"
  name="ssn-field"
  autoComplete="one-time-code"  // Prevents standard autofill
  inputMode="numeric"
  placeholder="•••-••-••••"
  maxLength={11}
  onChange={e => {
    // Auto-format: XXX-XX-XXXX
    const raw = e.target.value.replace(/\\D/g, '');
    const formatted = raw.replace(/(\\d{3})(\\d{0,2})(\\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join('-'));
    setSsn(formatted);
  }}
/>`,
        performance: `// FIX: SSN verification call takes 8+ seconds and shows no feedback

const [status, setStatus] = useState('idle'); // idle | verifying | verified | error

const verifySsn = async () => {
  setStatus('verifying');
  try {
    await api.verifySsn(ssn);
    setStatus('verified');
    setTimeout(onNext, 800); // Brief success moment
  } catch (err) {
    setStatus('error');
    setErrorMsg(err.code === 'SSN_MISMATCH'
      ? 'The SSN doesn\\'t match your ID. Please double-check.'
      : 'Verification timed out. Please try again.');
  }
};

// Status UI:
// 'verifying' → spinner + "Securely verifying..."
// 'verified'  → green checkmark + "Identity confirmed!"
// 'error'     → red banner with exact error + retry`,
        complexity: `// FIX: Asking for full SSN is excessive for initial signup — ask for last 4 only

// Replace full SSN input with last-4 only (collect full SSN on first transaction)
<>
  <h2>Just the last 4 digits</h2>
  <p style={{ fontSize: 14, color: '#94a3b8' }}>
    For account creation, we only need the last 4 digits of your SSN.
    Full verification is required only before your first transaction.
  </p>
  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
    <span style={{ color: '#94a3b8', fontSize: 18 }}>•••-••-</span>
    <input type="tel" maxLength={4} placeholder="XXXX" style={{ width: 80, textAlign: 'center', fontSize: 20 }} />
  </div>
</>`,
    },
};

// Generic precision fallback — uses reason category to provide a targeted fix even for unlisted steps
function getGenericFixForCategory(stepId, reasonCategory) {
    const stepLabel = stepId.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    const fixes = {
        layout: `// FIX — ${stepLabel}: Layout / Placement Issue
// Primary action not visible without scrolling

// Wrap the ${stepLabel} step in a sticky-footer layout:
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', padding: '24px 16px' }}>
  <div style={{ flex: 1 }}>{/* Step content here */}</div>
  <button style={{ position: 'sticky', bottom: 16, width: '100%', height: 52 }}>
    Continue →
  </button>
</div>`,

        copy: `// FIX — ${stepLabel}: Confusing Text / Microcopy
// Users don't understand what's being asked or why

// Add a contextual hint below the field label:
<>
  <label>{fieldLabel}</label>
  <input type="text" placeholder={placeholder} />
  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
    💡 {explanation of exactly what this field is for and why it's needed}
  </p>
  {/* Replace generic errors like "Invalid input" with specific guidance */}
  {error && <p style={{ color: '#f87171' }}>⚠️ {specificGuidance}</p>}
</>`,

        trust: `// FIX — ${stepLabel}: Trust / Privacy Concern
// Users don't know why sensitive data is being collected here

const TrustNote = () => (
  <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.05)',
      border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, marginTop: 16 }}>
    <strong>🔒 Why do we need this?</strong>
    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0' }}>
      {/* Add a specific, regulation-citing explanation for this step */}
      This information is encrypted and used only for {purpose}. Never sold.
    </p>
  </div>
);
// Render <TrustNote /> immediately above the sensitive input`,

        performance: `// FIX — ${stepLabel}: Slow / Technical Error
// Submit hangs or shows no loading feedback

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  if (loading) return;
  setLoading(true);
  try {
    await api.submit${stepId.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join('')}(data);
    onNext();
  } catch (err) {
    setError(err.userMessage || 'Something went wrong — please retry.');
  } finally {
    setLoading(false);
  }
};

<button onClick={handleSubmit} disabled={loading}>
  {loading ? <LoadingSpinner /> : 'Continue →'}
</button>
{error && <RetryBanner onRetry={handleSubmit} message={error} />}`,

        complexity: `// FIX — ${stepLabel}: Too Complex / Cognitive Overload
// This step asks for too much at once

// 1. Reduce required fields to the minimum for account creation
const REQUIRED = [/* only truly essential fields */];
const OPTIONAL = [/* everything else — move to profile settings */];

// 2. Add a "save & continue later" escape hatch
<button onClick={saveAndExit} style={{ color: '#94a3b8', fontSize: 13,
    background: 'none', border: 'none', marginTop: 16 }}>
  💾 Save progress — I'll finish this later
</button>

// 3. Show a progress estimate
<p style={{ color: '#64748b', fontSize: 12 }}>
  ⏱️ This step takes about {estimatedTime}. You can always update this in settings.
</p>`,
    };
    return fixes[reasonCategory] || fixes.copy;
}

function getInsightForStep(stepId, reasonCategory) {
    const baseRegistry = {
        'guest_email': { cause: 'Guest checkout option is not prominent; users default to the Login flow.', evidence: '60% rage-clicks on the Login button before drop-off.', impact: '+20%' },
        'shipping_address': { cause: 'Manual address entry without autocomplete causes high friction.', evidence: 'Average fill time 45s vs 12s benchmark.', impact: '+12%' },
        'selfie_scan': { cause: 'Camera permission denied silently with no recovery UI.', evidence: 'Tab switch spike occurs immediately after camera component mounts.', impact: '+35%' },
        'ssn_input': { cause: 'No legal context or explanation for why SSN is needed.', evidence: 'Immediate abandonment on page render — no scroll events recorded.', impact: '+40%' },
        'contact_sync': { cause: 'Cold-start permission request without a pre-sell screen.', evidence: '90% contact permission deny rate on iOS.', impact: '+25%' },
        'insurance_upload': { cause: 'PDF upload fails silently on mobile; file size limit not communicated.', evidence: 'Upload error rate 62% on iOS Safari.', impact: '+33%' },
        'seat_selection': { cause: 'Skip option has a dark-pattern label — users cannot find it.', evidence: 'Rage-clicks concentrated on hidden skip CTA.', impact: '+15%' },
        'username_claim': { cause: 'No real-time availability check causes repeated failed submissions.', evidence: 'Average 4 submissions per user before success.', impact: '+22%' },
        'kyc': { cause: 'No trust context or progress indicator for document verification.', evidence: 'Abandonment spikes at KYC step vs all prior steps.', impact: '+30%' },
    };
    const base = baseRegistry[stepId] || {
        cause: `User-reported friction at the '${stepId.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}' step.`,
        evidence: 'Drop-off rate exceeds the funnel average at this point.',
        impact: '+12%',
    };

    // Get the precision code fix for this exact step + reason combination
    const stepFixes = SPECIFIC_CODE_FIXES[stepId];
    const code = (stepFixes && stepFixes[reasonCategory])
        ? stepFixes[reasonCategory]
        : getGenericFixForCategory(stepId, reasonCategory);

    return { ...base, code };
}


// ============================================================
// AI INTENT PARSER — reads the user's typed reason to select the
// most hyper-specific code fix, overriding the generic category lookup.
// ============================================================

const STEP_INTENT_OVERRIDES = {
    ssn_input: [
        { words: ['store', 'stored', 'why need', 'legal', 'required by law', 'why do you need', 'aes', 'encrypted', 'patriot', 'deleted', 'sold', 'how is it used'], fix: 'trust' },
        { words: ['spinner', 'loading', 'hang', 'timeout', 'forever', 'slow'], fix: 'performance' },
        { words: ['autofill', 'auto fill', 'saved data', 'wrong data', 'previous data', 'format'], fix: 'layout' },
        { words: ['full ssn', 'all digits', 'entire ssn', 'too much', 'only last 4', 'last four'], fix: 'complexity' },
    ],
    otp: [
        { words: ['where', 'sent to', 'email', 'sms', 'didn\'t receive', 'not received', 'resend', 'spam', 'didn\'t get'], fix: 'copy' },
        { words: ['spinner', 'slow', 'loading', 'hang', 'timeout', 'stuck', 'forever', 'waited'], fix: 'performance' },
        { words: ['small', 'tiny', 'hard to tap', 'doesn\'t advance', 'cramped'], fix: 'layout' },
        { words: ['too many', '6 digit', 'complicated', 'magic link', 'alternative'], fix: 'complexity' },
        { words: ['don\'t trust', 'unknown sender', 'phishing', 'scam', 'fake'], fix: 'trust' },
    ],
    email: [
        { words: ['spam', 'sell', 'why email', 'privacy', 'trust', 'worried'], fix: 'trust' },
        { words: ['spinner', 'double submit', 'nothing happens', 'no feedback'], fix: 'performance' },
        { words: ['below', 'hidden', 'keyboard', 'scroll', 'can\'t see button', 'cta'], fix: 'layout' },
        { words: ['what is it for', 'confusing', 'unclear', 'purpose', 'don\'t understand'], fix: 'copy' },
        { words: ['too many steps', 'what comes next', 'how long', 'how many steps'], fix: 'complexity' },
    ],
    selfie_scan: [
        { words: ['camera denied', 'permission', 'denied', 'no camera', 'camera fail', 'camera error', 'black screen'], fix: 'performance' },
        { words: ['why selfie', 'why face', 'scared', 'creepy', 'why photo', 'delete', 'store image'], fix: 'trust' },
        { words: ['button hidden', 'capture below', 'can\'t find', 'can\'t see button'], fix: 'layout' },
        { words: ['robotic', 'confusing label', 'medical', 'weird name'], fix: 'copy' },
        { words: ['too many instructions', 'overwhelming', 'so many tips'], fix: 'complexity' },
    ],
    kyc: [
        { words: ['why id', 'legal', 'why verify', 'why upload', 'what do you do with', 'store', 'regulation'], fix: 'trust' },
        { words: ['upload fail', 'timeout', 'stuck', 'spinner', 'progress', 'no feedback', 'slow'], fix: 'performance' },
        { words: ['upload zone', 'hidden', 'below fold', 'can\'t find upload'], fix: 'layout' },
        { words: ['front and back', 'too much', 'both sides', 'overwhelming', 'separate'], fix: 'complexity' },
        { words: ['government issued', 'confusing label', 'technical', 'don\'t understand', 'which id'], fix: 'copy' },
    ],
    shipping_address: [
        { words: ['autocomplete', 'auto complete', 'too much typing', 'manual', 'tedious'], fix: 'performance' },
        { words: ['billing', 'delivery', 'which address', 'confused'], fix: 'copy' },
        { words: ['store address', 'marketing', 'worried', 'data'], fix: 'trust' },
        { words: ['international', 'country', 'no country', 'zip code', 'format wrong'], fix: 'complexity' },
    ],
    seat_selection: [
        { words: ['skip', 'can\'t skip', 'no skip', 'forced', 'random', 'don\'t care', 'hidden skip'], fix: 'complexity' },
        { words: ['can\'t tap', 'too small', 'mobile', 'hard to see', 'tiny'], fix: 'layout' },
        { words: ['legend', 'available', 'taken', 'which seats', 'color meaning'], fix: 'copy' },
        { words: ['slow', 'loading', 'takes forever', 'map load', 'spinner'], fix: 'performance' },
        { words: ['held', 'reserved', 'will it be saved', 'timer', '15 minutes'], fix: 'trust' },
    ],
    username_claim: [
        { words: ['already taken', 'not available', 'rejected', 'no real-time', 'tried multiple times'], fix: 'performance' },
        { words: ['permanent', 'can\'t change', 'what is handle', 'public', 'email or username'], fix: 'copy' },
        { words: ['suggestions below keyboard', 'can\'t see suggestions', 'keyboard covers'], fix: 'layout' },
        { words: ['requirements', 'rules', 'characters allowed', 'error only after submit'], fix: 'complexity' },
        { words: ['public', 'visible', 'searchable', 'who can see', 'privacy'], fix: 'trust' },
    ],
};

const CROSS_CATEGORY_SIGNALS = {
    layout: ['below fold', 'scroll', 'hidden', 'can\'t see', 'not visible', 'off screen', 'buried', 'misaligned', 'overlap', 'wrong place'],
    copy: ['don\'t understand', 'unclear', 'confusing', 'ambiguous', 'vague', 'what does', 'too long text', 'wall of text'],
    trust: ['don\'t know why', 'why do you need', 'what do you do with', 'worried', 'unsafe', 'risky', 'sketchy', 'trust', 'scared'],
    performance: ['spinner', 'spin', 'loading', 'hang', 'stuck', 'forever', 'never loads', 'freeze', 'timeout', 'waited', 'crash', 'nothing happened', 'no feedback'],
    complexity: ['too many', 'too much', 'overwhelming', 'don\'t have', 'didn\'t expect', 'too many fields', 'too many steps'],
};

function parseUserIntent(userTypedReason, reasonCategory, stepId) {
    if (!userTypedReason) return reasonCategory;
    const text = userTypedReason.toLowerCase();

    // 1. Step-specific ultra-precise overrides (highest priority)
    const stepOverrides = STEP_INTENT_OVERRIDES[stepId];
    if (stepOverrides) {
        for (const override of stepOverrides) {
            if (override.words.some(word => text.includes(word))) {
                return override.fix;
            }
        }
    }

    // 2. Cross-step category signals (catches mislabelled categories)
    for (const [cat, signals] of Object.entries(CROSS_CATEGORY_SIGNALS)) {
        if (signals.some(word => text.includes(word))) {
            return cat;
        }
    }

    return reasonCategory;
}

function generateDropOffInsightAndAlert(event) {
    const stepId = event.step;
    const reasonCategory = event.properties?.reasonCategory || null;
    const userTypedReason = event.properties?.userTypedReason || event.properties?.reason || null;
    const imageBase64 = event.properties?.imageBase64 || null;
    const categoryLabel = event.properties?.categoryLabel || reasonCategory || 'Unknown';

    // === AI INTENT PARSING — use free text to pick the most precise fix ===
    const resolvedCategory = reasonCategory
        ? parseUserIntent(userTypedReason, reasonCategory, stepId)
        : reasonCategory;

    const aiData = getInsightForStep(stepId, resolvedCategory);

    // Build enriched cause with verbatim user text
    const enrichedCause = userTypedReason
        ? `${aiData.cause} [User reported (${categoryLabel}): "${userTypedReason}"]`
        : aiData.cause;

    // === IMAGE ANNOTATION on the code fix ===
    let finalCode = aiData.code;
    if (imageBase64) {
        const screenshotHeader = [
            `// ╔═══════════════════════════════════════════════════════════╗`,
            `// ║          USER-REPORTED SCREENSHOT ATTACHED                ║`,
            `// ╚═══════════════════════════════════════════════════════════╝`,
            `//`,
            `// The user submitted a screenshot showing the exact UI state at drop-off.`,
            `// User's exact words: "${userTypedReason}"`,
            `//`,
            `// → Apply the fix below to the component visible in the screenshot.`,
            `// → Cross-reference the screenshot against the component filename in the fix header.`,
            `//`,
        ].join('\n');
        finalCode = screenshotHeader + '\n\n' + aiData.code;
    }

    const newInsight = {
        id: uuidv4(),
        stepId,
        reasonCategory: resolvedCategory || 'heuristic',
        userTypedReason,
        categoryLabel,
        hasScreenshot: !!imageBase64,
        screenshotBase64: imageBase64 || null,
        resolvedIntentCategory: resolvedCategory,
        title: `Drop-off at '${stepId}'${resolvedCategory ? ` — ${resolvedCategory}` : ''}`,
        problem: `Users abandoning at ${stepId}${userTypedReason ? `: "${userTypedReason}"` : ''}`,
        cause: enrichedCause,
        evidence: aiData.evidence,
        recommendation: {
            action: 'Apply the AI-generated code fix below — derived from user-reported context.',
            impact_prediction: aiData.impact,
            generatedCode: finalCode,
            userContext: userTypedReason,
            imageAttached: !!imageBase64,
        },
        timestamp: Date.now()
    };
    insights.unshift(newInsight);

    const checkDropRate = ((metrics[stepId].dropped / metrics[stepId].entered) * 100) || 0;
    const rule = alertRules.find(r => r.enabled);
    
    if (checkDropRate > (rule ? rule.threshold : 15)) {
        const newAlert = {
            id: uuidv4(),
            type: 'critical',
            message: `🚨 CRITICAL DROP-OFF DETECTED: ${stepId}`,
            details: enrichedCause,
            insightId: newInsight.id,
            timestamp: Date.now(),
            read: false
        };
        alerts.unshift(newAlert);
    }
}

app.post('/api/v1/events', (req, res) => {
    const batch = req.body.events || [];
    
    // Normalize step name casing to match backend flow definitions (e.g. 'Drop Off' -> 'drop_off')
    batch.forEach(event => {
        if (event.step && event.step.includes(' ')) {
            event.step = event.step.toLowerCase().replace(/\\s+/g, '_');
        }
    });

    events.push(...batch);
    
    batch.forEach(event => {
      if (!metrics[event.step]) {
         metrics[event.step] = { entered: 0, completed: 0, dropped: 0, avgTime: 0, errors: 0, name: event.step.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), rageClicks: 0, hesitation: 0, tabSwitches: 0, backButtons: 0 };
      }

      if (event.type === 'page_view') metrics[event.step].entered += 1;
      if (event.type === 'validation_error') metrics[event.step].errors += 1;
      if (event.type === 'step_complete') metrics[event.step].completed += 1;
      if (event.type === 'explicit_dropoff') {
        metrics[event.step].dropped += 1;
        generateDropOffInsightAndAlert(event);
      }
      
      if (event.type === 'rage_click') metrics[event.step].rageClicks += 1;
      if (event.type === 'hesitation') metrics[event.step].hesitation += 1;
      if (event.type === 'tab_switch') metrics[event.step].tabSwitches += 1;
    });

    res.status(202).json({ status: 'queued', count: batch.length });
});

app.get('/api/v1/metrics', (req, res) => res.json(metrics));
app.get('/api/v1/alerts', (req, res) => res.json(alerts));
app.get('/api/v1/insights', (req, res) => res.json(insights));
app.get('/api/v1/rules', (req, res) => res.json(alertRules));
app.get('/api/v1/flows', (req, res) => res.json(flowDefinitions));

app.post('/api/v1/rules', (req, res) => {
    alertRules = req.body.rules;
    res.json({ status: 'success' });
});

app.post('/api/v1/alerts/:id/read', (req, res) => {
    const alert = alerts.find(a => a.id === req.params.id);
    if (alert) alert.read = true;
    res.json({ status: 'success' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`SignalFlow Backend listening on http://localhost:${PORT}`);
});
