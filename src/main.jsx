import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hub from './Hub.jsx'
import Selah from './apps/selah/index.jsx'
import App2 from './apps/app2/index.jsx'
import App3 from './apps/app3/index.jsx'
import App4 from './apps/app4/index.jsx'
import App5 from './apps/app5/index.jsx'
import App6 from './apps/app6/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/selah/*" element={<Selah />} />
        <Route path="/app2/*" element={<App2 />} />
        <Route path="/app3/*" element={<App3 />} />
        <Route path="/app4/*" element={<App4 />} />
        <Route path="/app5/*" element={<App5 />} />
        <Route path="/app6/*" element={<App6 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
