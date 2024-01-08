import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import './ProfileStyle.css';
import CTA from '../Components/CTA';
import GlobalContext from '../GlobalContext';
import { getAuth } from 'firebase/auth';

function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { backendUrl } = React.useContext(GlobalContext);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
      setCurrentUser(user);
      try {
        user?.getIdToken().then((token) => {
          fetch(`${backendUrl}/users/`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          })
            .then((response) => response.json())
            .then((response) => {
              setCurrentUser(response);
            });
        });
      } catch (error: any) {
        console.error('Error updating username:', error.message);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col items-center flex-grow justify-center space-y-10">
        <p className="text-4xl font-SpaceGrotesk font-bold text-center pt-20 username-margin">
          {currentUser?.username}
        </p>
        <CTA
          buttonText="Update account settings"
          buttonStyle="bg-[#D9D9D9] text-black text-2xl px-16"
          onClick={() => {
            navigate('/update-settings');
          }}
        />
        <CTA
          buttonText="Update services"
          buttonStyle="bg-[#D9D9D9] text-black text-2xl px-16"
          onClick={() => {
            navigate('/update-services');
          }}
        />
      </div>
    </div>
  );
}

export default Profile;
