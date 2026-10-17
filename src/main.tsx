import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// The site is dark only. Drop the colour mode a former theme switch stored,
// so nothing is kept in localStorage any more.
try {
  window.localStorage.removeItem('theme')
} catch {
  // Storage can be blocked (privacy settings); then there is nothing to remove.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
