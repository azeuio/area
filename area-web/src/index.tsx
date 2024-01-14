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
import UpdateServices from './pages/UpdateServices';
import LinkReaction from './pages/LinkReaction';
import Profile from './pages/Profile';
import UpdateSettings from './pages/UpdateSettings';
import AddBoard from './pages/AddBoard';
import Board from './pages/Board';
import ManageBoard from './pages/ManageBoard';
import AddReaction from './pages/AddReaction';

initializeApp(firebaseConfig);

ReactDOM.render(
  <StrictMode>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
    />
    <GlobalContextProvider>
      <BrowserRouter>
        <Navbar style={{ height: defaultGlobalContext.navbarHeight }} />
        <Routes>
          <Route
            path="link-reaction/:boardid/:parentid"
            element={<LinkReaction />}
          />
          <Route /* Adds a trigger */
            path="add-action/:boardid"
            element={<LinkReaction />}
          />
          <Route /* Adds a trigger */
            path="add-reaction/:boardid/:serviceid"
            element={<AddReaction />}
          />
          <Route /* Adds a reaction */
            path="add-reaction/:boardid/:serviceid/:parentid"
            element={<AddReaction />}
          />
          <Route path="update-services" element={<UpdateServices />} />
          <Route path="select-services" element={<SelectServices />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="redirect/spotify" element={<Spotify />} />
          <Route path="redirect/deezer" element={<Spotify />} />
          <Route path="redirect/gmail" element={<Spotify />} />
          <Route path="redirect/get-auth-code" element={<Spotify />} />
          <Route path="boards" element={<Boards />} />
          <Route path="add-board" element={<AddBoard />} />
          <Route path="boards/:boardId" element={<Board />} />
          <Route path="manage-board/:boardId" element={<ManageBoard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="update-settings" element={<UpdateSettings />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);
