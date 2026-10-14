import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startPrivacyGuard } from './privacyGuard'
import './index.css'
import './theme.css'
import App from './App.jsx'

// Start the global privacy guard BEFORE React renders anything.
// This ensures the very first paint is already protected.
startPrivacyGuard();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
