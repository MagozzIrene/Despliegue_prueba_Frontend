import React from 'react'
import { Route, Routes } from 'react-router'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import AuthMiddleware from './Middlewares/AuthMiddleware'
import ContactListTest from './Screens/Test/ContactListTest'

function App() {

  return (

    <Routes>
      <Route path='/' element={<LoginScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route element={<AuthMiddleware />}>
        <Route path='/home' element={<h1>Home</h1>} />
        <Route path="/contacts" element={<ContactListTest />} />
      </Route>
    </Routes>

  )
}

export default App
