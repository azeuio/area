import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalContext from '../GlobalContext';
import BrickButton from '../Components/BrickButton';
import ServiceCard from '../Components/ServiceCard';
import { ActionDto, AreaDto, ServiceDto, WithId } from '../types';
import Requester from '../Requester';

type Parent = { action: ActionDto; service: ServiceDto };

function LinkReaction() {
  const navigate = useNavigate();
  const { getUser, backendUrl } = React.useContext(GlobalContext);
  const { parentid } = useParams() as { parentid: string };
  const { boardid } = useParams() as { boardid: string };
  const [services, setServices] = React.useState<WithId<ServiceDto>[]>([]);
  const [parentList, setParentList] = React.useState<Parent[]>([]);
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
        if (!parentid) return;
        const parentList: Parent[] = [];
        let areaId: string | undefined = parentid;
        while (areaId) {
          const user = await getUser();
          const userToken = await user?.getIdToken();
          if (!userToken) {
            console.log('User not found');
            navigate('/boards');
            break;
          }
          const response = await new Requester()
            .authorization(userToken)
            .get(`${backendUrl}/areas/area/${areaId}`);

          if (!response.ok) {
            console.log('Area not found', response.status);
            navigate('/boards');
            break;
          }
          const area: AreaDto = await response.json();

          const action: ActionDto = await new Requester()
            .get(`${backendUrl}/actions/${area.action.id}`)
            .then((response) => response.json());
          const service: ServiceDto = await new Requester()
            .get(`${backendUrl}/services/${action.service_id}`)
            .then((response) => response.json());
          parentList.push({ action, service });
          areaId = area.child_id;
        }
        console.log({ parentList });

        setParentList(parentList);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAction();
  }, [parentid, navigate, getUser, backendUrl]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userToken = await getUser()?.then((user) => {
          return user?.getIdToken();
        });
        const response = await new Requester()
          .authorization(userToken ?? '')
          .get(`${backendUrl}/services/active`);

        const json: Record<string, ServiceDto> = await response.json();
        setServices(
          Object.entries(json).map(([id, service]) => ({ id, ...service })),
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchServices();
  }, [backendUrl, getUser]);

  return (
    <div className="h-[90vh]">
      <div className="flex flex-col items-center">
        {parentList.length > 0 && (
          <>
            <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-10 pb-16">
              Selected action:
            </p>
            {parentList.map((parent, idx) => (
              <BrickButton
                key={parent.action.id + idx}
                color={numericColorToHex(Number(parent.service.color))}
                logo={parent.service.logo}
                text={parent.action.name}
                onClick={() => {
                  console.log('clicked');

                  navigate(
                    `/add-reaction/${boardid}/${parent.action.service_id}/${parentid}`,
                  );
                }}
              />
            ))}
          </>
        )}
        <p className="text-center text-6xl w-3/5 font-SpaceGrotesk pt-14 pb-16">
          Select a service to choose the{' '}
          {parentList.length > 0 ? 'reaction' : 'action'} from
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 place-items-center">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              backgroundColor={numericColorToHex(Number(service.color))}
              logo={service.logo ?? ''}
              name={service.name}
              activated={true}
              onClick={() => {
                if (parentList.length > 0) {
                  navigate(
                    `/add-reaction/${boardid}/${service.id}/${parentid}`,
                  );
                } else {
                  navigate(`/add-reaction/${boardid}/${service.id}`);
                  return;
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LinkReaction;
