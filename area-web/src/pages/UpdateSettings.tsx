import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

import CTA from '../Components/CTA';
import GlobalContext from '../GlobalContext';
import TextInput from '../Components/TextInput';
import ConfirmationModal from '../Components/ConfirmationModal';
import Modal from '../Components/Modal';
import {
  UpdateSettingsStatus,
  isSignedWithPassword,
  tryUpdateUsername,
  tryUpdateEmail,
  tryUpdatePassword,
  deleteAccount,
} from './UpdateSettingsLogic';

function UpdateSettings() {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(GlobalContext);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserToken, setCurrentUserToken] = useState<any>(null);
  const [actualUsername, setActualUsername] = useState<any>('');
  const [newUsername, setNewUsername] = useState<any>('');
  const [actualEmail, setActualEmail] = useState<any>('');
  const [newEmail, setNewEmail] = useState<any>('');
  const [actualPassword, setActualPassword] = useState<any>('');
  const [newPassword, setNewPassword] = useState<any>('');

  const [userWantToDeleteAccount, setUserWantToDeleteAccount] =
    useState<boolean>(false);
  const [updateEmailStatus, setUpdateEmailStatus] =
    useState<UpdateSettingsStatus>(UpdateSettingsStatus.NotUpdated);
  const [updatePasswordStatus, setUpdatePasswordStatus] =
    useState<UpdateSettingsStatus>(UpdateSettingsStatus.NotUpdated);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      }
      setCurrentUser(user);
      try {
        user?.getIdToken().then((token) => {
          setCurrentUserToken(token);
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
              setActualUsername(response.username ?? '');
              setNewUsername(response.username ?? '');
              setActualEmail(response.email ?? '');
              setNewEmail(response.email ?? '');
            });
        });
      } catch (error: any) {
        console.error('Error updating username:', error.message);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    await tryUpdateUsername(
      backendUrl,
      currentUserToken,
      actualUsername,
      newUsername,
    );
    const emailStatus = await tryUpdateEmail(
      backendUrl,
      currentUserToken,
      actualEmail,
      newEmail,
    );
    const passwordStatus = await tryUpdatePassword(
      backendUrl,
      actualPassword,
      newPassword,
    );

    setUpdateEmailStatus(emailStatus);
    setUpdatePasswordStatus(passwordStatus);
    if (
      emailStatus != UpdateSettingsStatus.NotUpdated ||
      passwordStatus === UpdateSettingsStatus.Error
    ) {
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="h-screen flex flex-col items-center flex-grow justify-center space-y-10">
      <p className="text-5xl font-SpaceGrotesk font-bold text-center">
        Account
      </p>
      <TextInput
        placeholder="username"
        textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]"
        onChange={(event) => setNewUsername(event.target.value)}
        textInputValue={newUsername}
      />
      {isSignedWithPassword(currentUser) ? (
        <div className="space-y-10">
          <TextInput
            placeholder="email"
            textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]"
            onChange={(event) => setNewEmail(event.target.value)}
            textInputValue={newEmail}
          />
          <TextInput
            placeholder="actual password"
            textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]"
            onChange={(event) => setActualPassword(event.target.value)}
            isPassword
          />
          <TextInput
            placeholder="new password"
            textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]"
            onChange={(event) => setNewPassword(event.target.value)}
            isPassword
          />
        </div>
      ) : (
        <div />
      )}
      <div className="flex space-x-5">
        <CTA
          buttonText="Delete Account"
          buttonStyle="bg-[#EA4335] text-white px-14"
          onClick={() => setUserWantToDeleteAccount(true)}
        />
        <CTA
          buttonText="Save"
          buttonStyle="bg-[#34A853] text-white px-14"
          onClick={handleSave}
        />
      </div>
      <ConfirmationModal
        isOpen={userWantToDeleteAccount}
        onConfirm={() => deleteAccount(backendUrl, currentUser, navigate)}
        onClose={() => setUserWantToDeleteAccount(false)}
        children={<p>Are you sure you want to delete your account ?</p>}
      />
      <Modal
        isOpen={updateEmailStatus != UpdateSettingsStatus.NotUpdated}
        onClose={() => {
          if (
            updatePasswordStatus === UpdateSettingsStatus.Error ||
            updateEmailStatus === UpdateSettingsStatus.Error
          ) {
            setUpdateEmailStatus(UpdateSettingsStatus.NotUpdated);
          } else {
            navigate('/profile');
          }
        }}
        children={
          updateEmailStatus === UpdateSettingsStatus.Updated ? (
            <p>
              Your email has been updated. Please check your inbox to confirm
              your new email.
            </p>
          ) : (
            <p>Error when updating your email. Please try again.</p>
          )
        }
      />
      <Modal
        isOpen={
          updatePasswordStatus === UpdateSettingsStatus.Error &&
          updateEmailStatus === UpdateSettingsStatus.NotUpdated
        }
        onClose={() => setUpdatePasswordStatus(UpdateSettingsStatus.NotUpdated)}
        children={<p>Error when updating your password. Please try again.</p>}
      />
    </div>
  );
}

export default UpdateSettings;
