import React from 'react';

import UserNavbar from './UserNavbar';
import area_logo from '../assets/area_logo.svg';
import default_profile from '../assets/profile_icon.svg';
import GetStartedNavbar from './GetStartedNavbar';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

type NavbarProps = {
  style?: {
    height: string;
  };
};
function Navbar(props: NavbarProps) {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = React.useState(false);
  const height = props.style?.height || '10vh';
  const { auth } = React.useContext(GlobalContext);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setIsLogged(true);
    }
  }, [auth.currentUser, navigate]);

  if (isLogged) {
    return (
      <UserNavbar
        logo={area_logo}
        logoLink="/"
        boardsLink="/boards"
        areasLink="/areas"
        image={default_profile}
        imageLink="/profile"
        isBoards={window.location.pathname === '/boards'}
        isAreas={window.location.pathname === '/areas'}
        style={{ height: height }}
      />
    );
  } else {
    return (
      <GetStartedNavbar
        logo={area_logo}
        logoLink="/"
        loginLink="/login"
        exploreLink="/explore"
        buttonOnClick={() => {
          navigate('/register');
        }}
        isExplore={window.location.pathname === '/explore'}
        isLogin={window.location.pathname === '/login'}
        style={{ height: height }}
      />
    );
  }
}

export default Navbar;
