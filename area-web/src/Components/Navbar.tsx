import React from 'react';

import UserNavbar from './UserNavbar';
import area_logo from '../assets/area_logo.svg';
import default_profile from '../assets/profile_icon.svg';
import GetStartedNavbar from './GetStartedNavbar';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
  style?: {
    height: string;
  };
};
function Navbar(props: NavbarProps) {
  const navigate = useNavigate();
  const loggedInPages = ['/boards', '/areas', '/profile', '/update-services',
    '/select-services', '/add-board', '/boards/:boardId', '/manage-board/:boardId', '/update-settings']
  const [isLogged, setIsLogged] = React.useState(loggedInPages.includes(window.location.pathname));
  const height = props.style?.height || '10vh';

  React.useEffect(() => {
    setIsLogged(loggedInPages.includes(window.location.pathname));
    const currentPath = window.location.pathname;
    const isLogged = loggedInPages.some((page) => {
      if (page.includes('/:')) {
        const pattern = new RegExp(`^${page.replace(/:[^/]+/, '[^/]+')}$`);
        return pattern.test(currentPath);
      } else {
        return page === currentPath;
      }
    });
    setIsLogged(isLogged);
  }, [navigate]);
  }, [navigate])

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
