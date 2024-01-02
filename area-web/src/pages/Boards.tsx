import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyServiceCard from '../Components/ServicesCards/SpotifyServiceCard';
import GlobalContext from '../GlobalContext';

function Boards() {
  const navigate = useNavigate();
  const { auth } = React.useContext(GlobalContext);

  // redirect to login if not logged in
  React.useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [auth.currentUser, navigate]);

  const style = {
    container: 'flex flex-col items-center',
    content: 'gap-[10%] grid-cols-3 grid w-[80%] justify-center',
  };

  // display service cards in a grid with 3 columns
  return (
    <>
      <div className={style.container}>
        <div className={style.content}>
          <SpotifyServiceCard />
          <SpotifyServiceCard />
          <SpotifyServiceCard />
          <SpotifyServiceCard />
        </div>
      </div>
    </>
  );
}

export default Boards;
