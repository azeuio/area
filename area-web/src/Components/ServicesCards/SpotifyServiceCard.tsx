import React from 'react';
import ServiceCard from '../ServiceCard';
import spotify_logo from '../../assets/spotify_logo.svg';
import GlobalContext from '../../GlobalContext';

const SpotifyServiceCard = () => {
  const { backendUrl, frontendUrl, getUser } = React.useContext(GlobalContext);
  const [spotifyToken, setSpotifyToken] = React.useState('');

  // get spotify token for the current user from the backend
  React.useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        return;
      }
      user
        .getIdToken()
        .then((token) => {
          fetch(`${backendUrl}/users/${user.uid}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data?.credentials?.spotify) {
                setSpotifyToken(data.credentials.spotify.token);
              }
            })
            .catch((error) => {
              console.error('Could not fetch user.', error);
            });
        })
        .catch((error) => {
          console.error('Could not get user token.', error);
        });
    });
  }, [backendUrl, getUser]);

  // get spotify token for the current user from the spotify api
  const getSpotifyAuth = async () => {
    const redirectUri = `${frontendUrl}/spotify-callback`;
    const response = await fetch(
      `${backendUrl}/services/spotify/auth/?redirect_uri=${encodeURIComponent(
        redirectUri,
      )}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    ).catch((error) => {
      console.error('Could not get Spotify auth code.', error);
    });
    if (!response) {
      return;
    }
    const url = await response.text();

    // Spotify auth popup
    const width = 500;
    const height = 800;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    const popup = window.open(url, 'Spotify', features);
    if (popup === null) {
      console.error('Spotify Sign-In failed. Please try again later.');
      return;
    }
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const code = event.data;
      popup?.close();

      if (!code) {
        console.error('Could not get Spotify auth code from popup.');
        return;
      }
      const tokenResponse = await fetch(
        `${backendUrl}/services/spotify/token?code=${code}&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      ).catch((error) => {
        console.error('Could not get Spotify auth token.', error);
      });
      if (!tokenResponse) {
        return;
      }
      const token = await tokenResponse.json();
      if (token.error !== undefined) {
        if (token.error === 'invalid_grant') {
          return;
        }
        console.error(
          `Could not get Spotify auth token. Error: ${token.error}`,
        );
        return;
      }
      const user = await getUser();
      if (!user) {
        console.warn('You are not logged in.');
        return;
      }
      const userToken = await user.getIdToken();
      const response = await fetch(`${backendUrl}/users/${user.uid}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        },
        body: JSON.stringify({
          credentials: {
            spotify: {
              code: code,
              token: token,
            },
          },
        }),
      });
      if (response.status !== 200) {
        console.error('Could not update user.');
        return;
      }
      setSpotifyToken(token);
    });
  };

  const deleteSpotifyAuth = async () => {
    const user = await getUser();
    if (!user) {
      console.warn('You are not logged in.');
      return;
    }
    const userToken = await user.getIdToken();
    const response = await fetch(`${backendUrl}/users/${user.uid}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userToken,
      },
      body: JSON.stringify({
        credentials: {
          spotify: null,
        },
      }),
    });
    if (response.status !== 200) {
      console.error('Could not update user.');
      return;
    }
  };
  return (
    <ServiceCard
      logo={spotify_logo}
      name="Spotify"
      serviceCardStyle="bg-[#1DB954] max-w-[300px] max-h-[300px]"
      onClick={() => {
        if (spotifyToken) {
          deleteSpotifyAuth();
          setSpotifyToken('');
        } else {
          getSpotifyAuth();
        }
      }}
      activated={spotifyToken !== ''}
    />
  );
};

export default SpotifyServiceCard;
