import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router'

import ContactsContextProvider from "./context/ContactsContext";
import AuthContextProvider from './context/AuthContext.jsx'
import MessagesContextProvider from './context/MessagesContext.jsx'
import GroupsContextProvider from './context/GroupsContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <GroupsContextProvider>
        <ContactsContextProvider>
          <MessagesContextProvider>
            <App />
          </MessagesContextProvider>
        </ContactsContextProvider>
      </GroupsContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
