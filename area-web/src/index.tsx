import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Playground from './pages/Playground';
import Register from './pages/Register';
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig.json';

initializeApp(firebaseConfig);

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="playground" element={<Playground />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<div>404</div>} />
      </Routes> 
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
