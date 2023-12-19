import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Register from './pages/Register';
import Login from './pages/Login';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.json';
import ForgotPassword from './pages/ForgotPassword';

initializeApp(firebaseConfig);

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<div>404</div>} />
      </Routes> 
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
