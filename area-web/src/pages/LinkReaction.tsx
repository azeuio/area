import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import BrickButton from '../Components/BrickButton';
import ServiceCard from '../Components/ServiceCard';

function LinkReaction() {
  const navigate = useNavigate();
  const { getUser } = React.useContext(GlobalContext);
  const { actionid } = useParams() as { actionid: string };
  const { boardid } = useParams() as { boardid: string };
  const [actionDetails, setActionDetails] = React.useState('NotFound');
  const [actionServiceId, setActionServiceId] = React.useState('NotFound');
  const [actionServicesSpecs, setActionServiceSpecs] = React.useState<any>({});
  const [services, setServices] = React.useState<any[]>([]);
  // redirect to login if not logged in
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [getUser, navigate]);

  function numericColorToHex(numericColor: number) {
    const hexColor = `#${numericColor.toString(16).slice(2).toUpperCase()}`;
    return hexColor;
  }

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/actions/' + actionid,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const json = await response.json();
        if (response.status === 404) {
          navigate('/boards');
          return;
        }
        setActionDetails(json.description);
        setActionServiceId(json.service_id);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAction();
  }, [actionid, navigate]);

  useEffect(() => {
    const fetchActionService = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/services/' + actionServiceId,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        const json = await response.json();
        setActionServiceSpecs(json);
      } catch (e) {
        console.log(e);
      }
    };
    if (actionServiceId !== 'NotFound') {
      fetchActionService();
    }
  }, [actionServiceId]);

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

  return (
    <div className="h-[90vh]">
      <div className="flex flex-col items-center">
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-10 pb-16">
          Selected action:
        </p>
        <BrickButton
          color={numericColorToHex(Number(actionServicesSpecs.color))}
          logo={actionServicesSpecs.logo}
          text={actionDetails}
        />
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-14 pb-16">
          Select a service to choose the reaction from:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
          {services.map((service: any) => (
            <ServiceCard
              key={service[0]}
              backgroundColor={numericColorToHex(Number(service[1].color))}
              logo={service[1].logo}
              name={service[1].name}
              activated={true}
              onClick={() => {
                navigate(
                  `/add-reaction/${boardid}/${actionid}/${service[1].id}`,
                );
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LinkReaction;
