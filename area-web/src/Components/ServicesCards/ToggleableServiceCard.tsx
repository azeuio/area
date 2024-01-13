import React from 'react';
import ServiceCard from '../ServiceCard';
import GlobalContext from '../../GlobalContext';
import createPopupGetOAuthCode from './createPopupGetOAuthCode';
import { User } from 'firebase/auth';
import Requester from '../../Requester';

import { ServiceDto } from '../../types';

interface DBUser {
  credentials?: Record<string, any>;
}

const fetchToken = async (
  backendUrl: string,
  code: string,
  redirect_uri: string,
  readableId: string,
) => {
  const response = await fetch(
    `${backendUrl}/services/${readableId}/token/?code=${encodeURIComponent(
      code,
    )}&redirect_uri=${encodeURIComponent(redirect_uri)}`,
    {
      method: 'GET',
    },
  ).catch((error) => {
    console.error(`Could not get ${readableId} token.`, error);
  });
  return response?.json();
};

const saveToken = async (
  backendUrl: string,
  firebaseUser: User,
  token: object,
  readableId: string,
) => {
  const idToken = await firebaseUser.getIdToken();
  const dbUser: DBUser = await fetch(`${backendUrl}/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
  })
    .catch((error) => {
      console.error('Could not get user.', error);
    })
    .then((res) => res?.json());
  dbUser.credentials = dbUser.credentials || {};

  await fetch(`${backendUrl}/users`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      credentials: {
        ...dbUser.credentials,
        [readableId]: {
          token,
        },
      },
    }),
  }).catch((error) => {
    console.error(`Could not save ${readableId} token.`, error);
  });
};

interface ToggleableServiceCardProps {
  id: string;
  readableId: string;
  logo: string;
}

function ToggleableServiceCard(props: ToggleableServiceCardProps) {
  const { backendUrl, frontendUrl, getUser } = React.useContext(GlobalContext);
  const [code, setCode] = React.useState('');
  const [serviceToken, setServiceToken] = React.useState<object | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [service, setService] = React.useState<ServiceDto | null>(null);
  const redirectUri = `${frontendUrl}/redirect/${props.readableId}`;

  // get service from backend
  React.useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await new Requester().get(
          `${backendUrl}/services/${props.id}`,
        );

        const json = await response.json();
        setService(json);
      } catch (e) {
        console.error('Could not fetch service.', e);
      }
    };
    fetchService();
  }, [backendUrl, getUser, props.id, setService]);

  // get user from firebase
  React.useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, [getUser]);

  // try to get service token from the backend
  React.useEffect(() => {
    if (!user) return;
    user
      .getIdToken()
      .then((token) => {
        new Requester()
          .authorization(token)
          .get(`${backendUrl}/users`)
          .then((response) => response.json())
          .then((data: DBUser | null) => {
            if (!data) return;
            if (data?.credentials?.[props.readableId]) {
              setServiceToken(data.credentials[props.readableId].token);
              saveToken(
                backendUrl,
                user,
                data.credentials[props.readableId].token,
                props.readableId,
              );
            }
          })
          .catch((error) => {
            console.error('Could not fetch user.', error);
          });
      })
      .catch((error) => {
        console.error('Could not get user token.', error);
      });
  }, [backendUrl, props.readableId, user]);

  const openAuthPopup = async () => {
    // const response = await fetch(
    //   `${backendUrl}/services/${props.readableId}/auth/?redirect_uri=${encodeURIComponent(
    //     redirectUri,
    //   )}`,
    //   {
    //     method: 'GET',
    //   },
    const response = await new Requester()
      .get(
        `${backendUrl}/services/${
          props.readableId
        }/auth/?redirect_uri=${encodeURIComponent(redirectUri)}`,
      )
      .catch((error) => {
        console.error(`Could not get ${props.readableId} auth code.`, error);
      });
    if (!response) {
      return;
    }
    const url = await response.text();
    const { code } = await createPopupGetOAuthCode(url);
    setCode(code);
  };

  React.useEffect(() => {
    if (!code) return;
    console.log(props.readableId, code);

    fetchToken(backendUrl, code, redirectUri, props.readableId)
      .then((token) => {
        if (!token) return;
        setServiceToken(token);
        setCode('');
      })
      .catch((error) => {
        console.error(`Could not get ${props.readableId} token.`, error);
      });
  }, [backendUrl, code, user, redirectUri, props.readableId]);

  // save token to backend
  React.useEffect(() => {
    if (!serviceToken) return;
    if (!user) return;
    saveToken(backendUrl, user, serviceToken, props.readableId);
  }, [backendUrl, serviceToken, user, props.readableId]);

  function numericColorToHex(numericColor?: number | string) {
    if (!numericColor) return;
    if (typeof numericColor === 'string') {
      numericColor = parseInt(numericColor);
    }
    const hexColor = `#${numericColor.toString(16).slice(2).toUpperCase()}`;
    return hexColor;
  }

  const removeToken = async () => {
    const user = await getUser();
    if (!user) {
      console.warn('You are not logged in.');
      return;
    }
    const userToken = await user.getIdToken();
    await new Requester()
      .authorization(userToken)
      .delete(
        `${backendUrl}/users/${user.uid}/credentials/${props.readableId}`,
      );
  };
  return (
    <ServiceCard
      name={service?.name ?? 'Service'}
      logo={props.logo ?? service?.name ?? 'Service'}
      activated={serviceToken !== null}
      onClick={() => {
        if (serviceToken !== null) {
          removeToken().then(() => setServiceToken(null));
        } else {
          openAuthPopup();
        }
      }}
      backgroundColor={numericColorToHex(service?.color) ?? '#D44638'}
    />
  );
}

export default ToggleableServiceCard;
