import React, { useContext } from 'react';
import BrickButton from './BrickButton';
import { ActionDto, AreaDto, ServiceDto } from '../types';
import Redirect from './Redirect';
import Spinner from './Spinner';
import PromiseBuilder from './PromiseBuilder';
import { useNavigate } from 'react-router';
import GlobalContext from '../GlobalContext';
import Requester from '../Requester';

const hexNumberToRGB = (hex: string) => {
  const hexNumber = parseInt(hex, 16);
  const r = (hexNumber >> 16) & 255;
  const g = (hexNumber >> 8) & 255;
  const b = hexNumber & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

interface BrickStackProps {
  chain: (AreaDto & { id: string })[];
}
const BrickStack = ({ chain }: BrickStackProps) => {
  const navigate = useNavigate();
  const { backendUrl, getUser } = useContext(GlobalContext);

  return (
    <PromiseBuilder
      promise={async () => {
        const user = await getUser();
        const userToken = await user?.getIdToken();
        if (!user || !userToken) {
          throw new Error('User not logged in');
        }
        return {
          actions: (await new Requester()
            .authorization(userToken)
            .get(`${backendUrl}/actions/`)
            .then((response) => response.json())) as ActionDto[],
          services: (await new Requester()
            .authorization(userToken)
            .get(`${backendUrl}/services/`)
            .then((response) => response.json())) as Record<string, ServiceDto>,
        };
      }}
      loading={<Spinner />}
      error={<Redirect to="/boards" />}
      builder={({ actions, services }) => (
        <>
          {chain.map((area, idx, arr) => {
            const action: ActionDto | undefined = actions.find(
              (action) => action.id === area.action.id,
            );
            if (!action) return null;
            return (
              <BrickButton
                key={area.id}
                text={action.name}
                onClick={() => {
                  navigate(`/link-reaction/${area.board_id}/${area.id}`);
                }}
                logo={services[action.service_id].logo}
                color={hexNumberToRGB(services[action.service_id].color)}
              />
            );
          })}
        </>
      )}
      deps={[]}
    />
  );
};

export default BrickStack;
