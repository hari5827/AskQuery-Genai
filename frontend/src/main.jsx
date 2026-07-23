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
// in well under a second — cutting its animation off mid-play. Cycle it
// through a short branded status sequence, hold, fade, then mount.
const loader = document.getElementById('initial-loader')
const statusEl = document.getElementById('loader-status')

const LOADER_STAGES = [
  'Initializing AI...',
  'Loading Models...',
  'Connecting Vector Database...',
  'Preparing Workspace...',
]
const STAGE_MS = 380

if (loader && statusEl) {
  let stageIndex = 0

  const stageTimer = setInterval(() => {
    stageIndex += 1
    if (stageIndex >= LOADER_STAGES.length) {
      clearInterval(stageTimer)
      return
    }
    statusEl.textContent = LOADER_STAGES[stageIndex]
    statusEl.classList.remove('is-switching')
    // Force reflow so the switch-in animation replays on each change.
    void statusEl.offsetWidth
    statusEl.classList.add('is-switching')
  }, STAGE_MS)

  setTimeout(() => {
    clearInterval(stageTimer)
    loader.style.transition = 'opacity 300ms ease'
    loader.style.opacity = '0'
    setTimeout(mountApp, 300)
  }, LOADER_STAGES.length * STAGE_MS + 200)
} else {
  mountApp()
}
