import React from 'react';
import { useNavigate } from 'react-router-dom';

import GetStartedNavbar from '../Components/GetStartedNavbar';
import UserNavbar from '../Components/UserNavbar';
import area_logo from '../assets/area_logo.svg';
import profile_icon from '../assets/profile_icon.svg';

function Playground() {
  const navigate = useNavigate();
  return (
    <div>
      <GetStartedNavbar
        logo={area_logo}
        logoLink="/"
        loginLink="/login"
        exploreLink="/explore"
        buttonOnClick={() => {
          navigate('/getstarted');
        }}
      />
      <UserNavbar
        logo={area_logo}
        logoLink="/"
        boardsLink="/boards"
        areasLink="/areas"
        image={profile_icon}
        imageLink="/profile"
      />
    </div>
  );
}

export default Playground;
