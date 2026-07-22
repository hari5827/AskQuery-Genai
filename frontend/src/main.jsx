import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/app.store'
import { Provider } from 'react-redux'

import './app/index.css'
import App from './app/App.jsx'

function mountApp() {
  createRoot(document.getElementById('root')).render(
    <StrictMode >
      <Provider store={store}>
        <App />
     </Provider>
    </StrictMode>,
  )
}

// The static loading screen in index.html paints instantly (before this
// bundle even loads), but on a fast connection React can finish mounting
// in well under a second — cutting its animation off mid-play. Hold it
// for a minimum time, then fade it out, before swapping in the real app.
const loader = document.getElementById('initial-loader')

if (loader) {
  setTimeout(() => {
    loader.style.transition = 'opacity 300ms ease'
    loader.style.opacity = '0'
    setTimeout(mountApp, 300)
  }, 900)
} else {
  mountApp()
}

