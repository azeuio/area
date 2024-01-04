import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

import SpotifyServiceCard from '../Components/ServicesCards/SpotifyServiceCard';
import CTA from '../Components/CTA';

function ServicesPage() {
  const navigate = useNavigate();
  const { getUser } = React.useContext(GlobalContext);

  // redirect to login if not logged in
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  return (
    <div className="h-[90vh]">
      <div className="flex flex-col items-center">
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-10 pb-16">
          Services
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
            <SpotifyServiceCard />
        </ul>
        <div className='fixed bottom-14 right-36'>
            <CTA buttonText="Validate" buttonStyle="bg-[#34A853] text-white text-5xl px-16" onClick={() => {navigate('Maghreb')}}/>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
