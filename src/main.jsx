import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { signalFlow } from './sdk/tracker'

// Initialize tracker mock
signalFlow.init({
  apiKey: 'demo_key_123',
  funnelId: 'mvp_demo_funnel'
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
