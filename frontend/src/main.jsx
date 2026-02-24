import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster
      containerId="toast-global"
      position="top-center"
      toastOptions={{
        duration: 1600,
        style: {
          background: '#0a1a2f',
          color: '#c0fefe',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
        },
      }}
    />
    <App />
  </BrowserRouter>
)