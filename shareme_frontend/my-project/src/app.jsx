import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './container/Home'
import Login from './components/Login'
//assets
const App = () => {
  const userInfo = localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  const isLoggedIn = Boolean(userInfo?.googleId);

  return (
    <Routes>
      <Route path="login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
    </Routes>
  )
  
}
export default App      
                           