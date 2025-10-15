import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router'

import ContactsContextProvider from "./context/ContactsContext";
import AuthContextProvider from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ContactsContextProvider>
        <App />
      </ContactsContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
