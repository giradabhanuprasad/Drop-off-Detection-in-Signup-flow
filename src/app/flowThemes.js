// Per-flow visual theme configurations for the Simulator UI
// Each flow gets its own color palette, gradient, icon, and step-specific field hints

export const FLOW_THEMES = {
  saas: {
    name: 'Hushh.ai Classic',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#5c6fff',
    textColor: '#ffffff',
    tagline: 'Personalized AI onboarding',
    stepIcons: {
      email: '✉️', otp: '🔐', profile: '👤', kyc: '🪪', bank: '🏦', preferences: '⚙️', payment: '💳'
    },
    stepHints: {
      email: 'We use this to send you your personalized AI insights.',
      otp: 'A 6-digit code has been sent to your email.',
      profile: 'Help the AI understand you better.',
      kyc: 'We are required to verify your identity by regulation.',
      bank: 'Connect your bank to unlock spending insights.',
      preferences: 'Pick what matters most to you.',
      payment: 'Start your 14-day free trial. Cancel anytime.'
    }
  },
  ecommerce: {
    name: 'Guest Checkout',
    icon: '🛍️',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #2d1b4e 50%, #1a0f2e 100%)',
    accentColor: '#a855f7',
    textColor: '#ffffff',
    tagline: 'Fast. Secure. No account needed.',
    stepIcons: {
      cart_review: '🛒', guest_email: '📧', shipping_address: '📦', shipping_method: '🚚', credit_card: '💳', order_review: '✅'
    },
    stepHints: {
      cart_review: 'Review your items before checkout.',
      guest_email: 'Your order confirmation will be sent here.',
      shipping_address: 'Where should we deliver your order?',
      shipping_method: 'Choose a shipping speed that works for you.',
      credit_card: 'Secured with 256-bit SSL encryption.',
      order_review: 'Final check before we process your order.'
    }
  },
  fintech: {
    name: 'Crypto App Signup',
    icon: '₿',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 50%, #061206 100%)',
    accentColor: '#22c55e',
    textColor: '#22c55e',
    tagline: 'Your keys. Your crypto. Your future.',
    stepIcons: {
      phone_verify: '📱', selfie_scan: '🤳', id_upload: '🪪', ssn_input: '🔒', connect_plaid: '🏦', setup_pin: '🔑'
    },
    stepHints: {
      phone_verify: 'Required for 2FA. Your number is never shared.',
      selfie_scan: 'Verify you are real. FinCEN compliance.',
      id_upload: 'Upload a government-issued photo ID.',
      ssn_input: 'Required by Federal Patriot Act. We never sell this.',
      connect_plaid: 'Link your bank via Plaid to fund your wallet.',
      setup_pin: 'Set a secure PIN for transaction approvals.'
    }
  },
  social: {
    name: 'Gen-Z Social App',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #1f0036 0%, #3b0764 50%, #0f0824 100%)',
    accentColor: '#e879f9',
    textColor: '#f0abfc',
    tagline: 'Be real. Be you. Find your people.',
    stepIcons: {
      handle_select: '🏷️', contact_sync: '👥', invite_friends: '💌', avatar_upload: '🖼️', select_hashtags: '#️⃣'
    },
    stepHints: {
      handle_select: 'Pick your unique handle. Make it memorable.',
      contact_sync: 'Find who\'s already here — they\'ll never know you searched.',
      invite_friends: 'Your crew is waiting. Send them an invite.',
      avatar_upload: 'Drop your best photo or make it abstract.',
      select_hashtags: 'Pick your vibe. We\'ll fill your feed with what you love.'
    }
  },
  healthcare: {
    name: 'Patient Portal',
    icon: '🏥',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a2030 100%)',
    accentColor: '#38bdf8',
    textColor: '#ffffff',
    tagline: 'Your health records. Secure and always accessible.',
    stepIcons: {
      patient_verify: '🪪', insurance_upload: '📋', medical_history: '📑', hippa_consent: '✍️', emergency_contact: '🚨'
    },
    stepHints: {
      patient_verify: 'Verify your identity to access your records.',
      insurance_upload: 'Upload your insurance card (front & back).',
      medical_history: 'This helps your care team prepare for your visit.',
      hippa_consent: 'Review and sign your HIPAA privacy authorization.',
      emergency_contact: 'Who should we contact in an emergency?'
    }
  },
  edtech: {
    name: 'Learning Platform',
    icon: '📚',
    gradient: 'linear-gradient(135deg, #1c1203 0%, #2d1e05 50%, #161002 100%)',
    accentColor: '#fbbf24',
    textColor: '#fef3c7',
    tagline: 'Learn anything. Anytime. At your pace.',
    stepIcons: {
      role_select: '👩‍🎓', grade_level: '🎓', subject_select: '📖', invite_parents: '👨‍👩‍👧', download_app: '📲'
    },
    stepHints: {
      role_select: 'Are you a student, teacher, or parent?',
      grade_level: 'We\'ll personalize your curriculum to your level.',
      subject_select: 'Pick the subjects you want to master.',
      invite_parents: 'Invite a parent for progress tracking.',
      download_app: 'Download the app to learn on the go.'
    }
  },
  travel: {
    name: 'Flight Booking',
    icon: '✈️',
    gradient: 'linear-gradient(135deg, #05071a 0%, #0c1445 50%, #091232 100%)',
    accentColor: '#60a5fa',
    textColor: '#ffffff',
    tagline: 'The sky is not the limit. It\'s just the beginning.',
    stepIcons: {
      flight_select: '✈️', passenger_details: '🧳', seat_selection: '💺', baggage_addon: '🎒', travel_insurance: '🛡️', travel_payment: '💳'
    },
    stepHints: {
      flight_select: 'Departure, destination, date — nail it down.',
      passenger_details: 'Enter details as they appear on your passport.',
      seat_selection: 'Pick your spot or let us assign one randomly.',
      baggage_addon: 'Add checked bags now to save at the airport.',
      travel_insurance: 'Protect your trip against unexpected cancellations.',
      travel_payment: 'Secure checkout. Free cancellation within 24hrs.'
    }
  },
  gaming: {
    name: 'MMO Account',
    icon: '🎮',
    gradient: 'linear-gradient(135deg, #0d001a 0%, #1a0033 50%, #0a0014 100%)',
    accentColor: '#c084fc',
    textColor: '#f3e8ff',
    tagline: 'Your legend begins. Claim your name.',
    stepIcons: {
      username_claim: '🏆', age_verify: '🎂', link_discord: '💬', newsletter_optin: '📨', download_launcher: '⬇️'
    },
    stepHints: {
      username_claim: 'Your username is permanent. Choose wisely.',
      age_verify: 'Confirm you\'re 13+ to create an account.',
      link_discord: 'Link Discord to connect with your guild instantly.',
      newsletter_optin: 'Get patch notes, events, and exclusive drops.',
      download_launcher: 'Download the launcher to start playing.'
    }
  }
};
