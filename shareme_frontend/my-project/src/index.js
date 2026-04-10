import React from 'react'
import ReactDOM from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import {BrowserRouter as Router} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './app.jsx'
import './style.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
const googleClientId = import.meta.env.VITE_GOOGLE_API_TOKEN

root.render(
  React.createElement(
    GoogleOAuthProvider,
    {clientId: googleClientId || ''},
    React.createElement(
      Router,
      null,
      React.createElement(App, null),
      React.createElement(Toaster, { position: 'top-right' }),
    ),
  ),
)