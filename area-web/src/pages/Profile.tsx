import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CTA from '../Components/CTA';
import GlobalContext from '../GlobalContext';

function Profile() {
  const navigate = useNavigate();
  const [user_infos, setUserInfos] = useState<any>(null);
  const { backendUrl, getUser } = useContext(GlobalContext);

  const getUserInfos = async () => {
    const user = await getUser();
    const auth = `Bearer ${await user?.getIdToken()}`;

    const user_infos = await fetch(`${backendUrl}/users/${user?.uid}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    });
    return user_infos;
  };

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      getUserInfos().then(async (res) => {
        setUserInfos(await res.json());
      });
    });
  }, [getUser, navigate]);
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col items-center flex-grow justify-center space-y-10">
        <p className="text-4xl font-SpaceGrotesk font-bold text-center pt-20">
          {user_infos?.username}
        </p>
        <CTA
          buttonText="Update account settings"
          buttonStyle="bg-[#D9D9D9] text-black text-2xl px-16"
          onClick={() => {
            console.log('Profile');
          }}
        />
        <CTA
          buttonText="Update services"
          buttonStyle="bg-[#D9D9D9] text-black text-2xl px-16"
          onClick={() => {
            console.log('Profile');
          }}
        />
        <CTA
          buttonText="Activity history"
          buttonStyle="bg-[#D9D9D9] text-black text-2xl px-16"
          onClick={() => {
            console.log('Profile');
          }}
        />
      </div>
    </div>
  );
}

export default Profile;
