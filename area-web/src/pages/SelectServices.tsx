import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import GlobalContext from '../GlobalContext';

import ServiceCard from '../Components/ServiceCard';

function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = React.useState<any[]>([]);
  const { getUser } = React.useContext(GlobalContext);

  // redirect to login if not logged in
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userToken = await getUser()?.then((user) => {
          return user?.getIdToken();
        });
        const response = await fetch('http://localhost:8080/services/active', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userToken,
          },
        });

        const json = await response.json();
        setServices(Object.entries(json));
      } catch (e) {
        console.log(e);
      }
    };
    fetchServices();
  }, [getUser]);

  function numericColorToHex(numericColor: number) {
    const hexColor = `#${numericColor.toString(16).slice(2).toUpperCase()}`;
    return hexColor;
  }
  return (
    <div className="h-[90vh]">
      <div className="flex flex-col items-center">
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-10 pb-16">
          Select a service to choose the action from:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
          {services.map((service: any) => (
            <ServiceCard
              key={service[0]}
              backgroundColor={numericColorToHex(Number(service[1].color))}
              logo={service[1]}
              name={service[1].name}
              activated={true}
              onClick={() => {
                navigate(`/select-action/${service[1].id}`);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ServicesPage;
