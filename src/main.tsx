import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle redirect from 404.html for SPA routing
const redirect = sessionStorage.getItem('redirect')
if (redirect && redirect !== location.href) {
  sessionStorage.removeItem('redirect')
  history.replaceState(null, '', redirect.split(location.origin)[1])
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)