import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './assets/components/Login/Dasboard.jsx'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Dashboard />
  </StrictMode>
)
