import { v4 as uuidv4 } from 'uuid';
import { mockApi } from '../services/mockApi';

class SignalFlowTracker {
  constructor() {
    this.sessionId = uuidv4();
    this.events = [];
    this.currentStep = null;
    this.stepStartTime = null;
  }

  init(config) {
    this.apiKey = config.apiKey;
    this.funnelId = config.funnelId;
    console.log(`[SignalFlow SDK] Initialized for funnel: ${this.funnelId}`);
    this._attachBehavioralListeners();
  }

  _attachBehavioralListeners() {
    // 1. Tab Switches
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'hidden' && this.currentStep) {
        this._sendEvent({ type: 'tab_switch', step: this.currentStep });
      }
    });

    // 2. Hesitation Tracking
    let hesitationTimer;
    document.addEventListener("mousemove", () => {
      clearTimeout(hesitationTimer);
      hesitationTimer = setTimeout(() => {
         if (this.currentStep) {
             this._sendEvent({ type: 'hesitation', step: this.currentStep, duration: 5000 });
         }
      }, 5000); // 5 sec hesitation
    });

    // 3. Rage Clicks
    let clickCount = 0;
    let clickTimer;
    document.addEventListener("click", (e) => {
      clickCount++;
      if (clickCount >= 3) {
         if (this.currentStep) {
            this._sendEvent({ type: 'rage_click', step: this.currentStep, target: e.target.tagName });
         }
         clickCount = 0;
      }
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 2000); // Reset if clicks are 2+ sec apart
    });
  }

  trackPageView(stepId) {
    const now = Date.now();
    if (this.currentStep && this.currentStep !== stepId) {
       this._sendEvent({
           type: 'step_leave',
           step: this.currentStep,
           timeSpent: now - this.stepStartTime
       });
    }

    this.currentStep = stepId;
    this.stepStartTime = now;

    this._sendEvent({
      type: 'page_view',
      step: stepId,
      url: window.location.href
    });
  }

  trackInputFocus(fieldId) {
    if (!this.currentStep) return;
    this._sendEvent({
      type: 'input_focus',
      step: this.currentStep,
      field: fieldId
    });
  }

  trackError(fieldId, errorMessage) {
    if (!this.currentStep) return;
    this._sendEvent({
      type: 'validation_error',
      step: this.currentStep,
      field: fieldId,
      error: errorMessage
    });
  }

  trackDropOff(stepId, metadata = {}) {
    const timeSpent = Date.now() - this.stepStartTime;
    const dropOffEvent = {
        type: 'explicit_dropoff',
        step: stepId || this.currentStep,
        timeSpent,
        // Expose reason context in the 'properties' envelope for the backend AI engine
        properties: {
          reason: metadata.reason || null,
          reasonCategory: metadata.reasonCategory || null,
          categoryLabel: metadata.categoryLabel || null,
          customNote: metadata.customNote || null,
          flow: metadata.flow || null,
        },
        metadata
    };
    this._sendEvent(dropOffEvent);
    this.flush();
  }

  trackCompletion(stepId) {
    const timeSpent = Date.now() - this.stepStartTime;
    this._sendEvent({
      type: 'step_complete',
      step: stepId || this.currentStep,
      timeSpent
    });
    this.flush();
  }

  _sendEvent(eventData) {
    const event = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      funnelId: this.funnelId
    };
    this.events.push(event);
    
    // Batch process
    if (this.events.length >= 3) {
      this.flush();
    }
  }

  flush() {
    if (this.events.length === 0) return;
    const batch = [...this.events];
    this.events = [];
    
    fetch('http://localhost:3001/api/v1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch })
    }).catch(e => console.error("SignalFlow SDK sync failed", e));
  }
}

export const signalFlow = new SignalFlowTracker();
