import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/app.store'
import { Provider } from 'react-redux'

import './app/index.css'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode >
    <Provider store={store}>
      <App />
   </Provider>
  </StrictMode>,
)

  

