import '../src/app/layout/style.css'
import ReactDOM from 'react-dom/client'
import './index.css'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/Routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(  
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
