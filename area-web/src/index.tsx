import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { GlobalContextProvider, defaultGlobalContext } from './GlobalContext';
import Register from './pages/Register';
import Login from './pages/Login';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig.json';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Spotify from './pages/Spotify';
import Boards from './pages/Boards';
import Page404 from './pages/Page404';
import Navbar from './Components/Navbar';
import SelectServices from './pages/SelectServices';
import Profile from './pages/Profile';

initializeApp(firebaseConfig);

ReactDOM.render(
  <StrictMode>
    <GlobalContextProvider>
      <BrowserRouter>
        <Navbar style={{ height: defaultGlobalContext.navbarHeight }} />
        <Routes>
          <Route path="select-services" element={<SelectServices />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="spotify-callback" element={<Spotify />} />
          <Route path="boards" element={<Boards />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);
