import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './assets/locales/i18n.tsx'

const CURRENT_VERSION = import.meta.env.VITE_APP_VERSION;
const cachedVersion = localStorage.getItem('app_version');

if (cachedVersion && cachedVersion !== CURRENT_VERSION) {
  console.log('New app version detected, reloading page...');
  localStorage.setItem('app_version', CURRENT_VERSION);
  window.location.reload();
} else {
  localStorage.setItem('app_version', CURRENT_VERSION);
  const root = createRoot(document.getElementById('root')!)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}