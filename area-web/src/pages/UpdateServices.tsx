import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../GlobalContext';

import CTA from '../Components/CTA';
import ToggleableServiceCard from '../Components/ServicesCards/ToggleableServiceCard';
import { Service } from '../types';
import Requester from '../Requester';

function ServicesPage() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = React.useContext(GlobalContext);

  // redirect to login if not logged in
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);
  const [services, setServices] = React.useState<Record<string, Service>>({});
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await new Requester()
          .get(`${backendUrl}/services`)
          .then((response) => response.json());

        setServices(services);
      } catch (e) {
        console.log(e);
      }
    };
    fetchServices();
  }, []);
  // foreach id, item in services
  return (
    <div className="h-[90vh]">
      <div className="flex flex-col items-center">
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-10 pb-16">
          Services
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
          {Object.entries(services).map(([id, service]) => (
            <ToggleableServiceCard
              key={id}
              id={id}
              readableId={service.name.toLowerCase().replace(' ', '-')}
              logo={service.logo ?? service.name}
            />
          ))}
        </ul>
        <div className="fixed bottom-14 right-36">
          <CTA
            buttonText="Validate"
            buttonStyle="bg-[#34A853] text-white text-5xl px-16"
            onClick={() => {
              navigate('/profile');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
