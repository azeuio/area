import React, { useContext } from 'react';
import {
    getAuth,
    updatePassword,
    EmailAuthProvider,
    verifyBeforeUpdateEmail,
    reauthenticateWithCredential,
    User
} from 'firebase/auth';

import GlobalContext from '../GlobalContext';
import { NavigateFunction } from 'react-router-dom';

enum UpdateSettingsStatus {
    Updated,
    Error,
    NotUpdated,
}

function isSignedWithPassword(user: User): boolean {
    if (user) {
        const providerData = user.providerData;

        for (const data of providerData) {
            if (data.providerId === 'password') {
                return true;
            }
        }
        return false;
      }
    return false;
}

async function tryUpdateUsername(backendUrl: string, userToken: string, actualUsername: string, newUsername: string): Promise<UpdateSettingsStatus> {
    if (newUsername !== '' && newUsername !== actualUsername) {
        try {
            const response = await fetch(`${backendUrl}/users/`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + userToken,
                },
                body: JSON.stringify({ username: newUsername }),
            });
            if (!response.ok) {
                throw new Error('Error updating username');
            } else {
                return UpdateSettingsStatus.Updated;
            }
        } catch (error:any) {
            console.error('Error updating username:', error.message);
            return UpdateSettingsStatus.Error;
        }
    }
    return UpdateSettingsStatus.NotUpdated;
}

async function tryUpdateEmail(backendUrl: string, userToken: string, actualEmail: string, newEmail: string): Promise<UpdateSettingsStatus> {
    if (newEmail !== '' && newEmail !== actualEmail) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            return UpdateSettingsStatus.Error;
        }
        try {
            verifyBeforeUpdateEmail(user, newEmail);
            await fetch(`${backendUrl}/users/`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + userToken,
                },
                body: JSON.stringify({ email: newEmail }),
            });
            return UpdateSettingsStatus.Updated;
        } catch (error: any) {
            console.error('Error updating email:', error.message);
            return UpdateSettingsStatus.Error;
        }
    }
    return UpdateSettingsStatus.NotUpdated;
}

async function tryUpdatePassword(backendUrl: string, actualPassword: string, newPassword: string): Promise<UpdateSettingsStatus> {
    if (actualPassword !== '' && newPassword !== '' && actualPassword !== newPassword) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user?.email) {
            return UpdateSettingsStatus.Error;
        }
        try {
            await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, actualPassword));
            await updatePassword(user, newPassword);
            return UpdateSettingsStatus.Updated;
        } catch (error: any) {
            console.error('Error updating password:', error.message);
            return UpdateSettingsStatus.Error;
        }
    }
    return UpdateSettingsStatus.NotUpdated;
}

async function deleteAccount(backendUrl: string ,user: User, navigate: NavigateFunction) {
    const userToken = await user.getIdToken();

    await fetch(`${backendUrl}/users`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userToken,
        },
    })
    navigate('/register');
};

export { UpdateSettingsStatus, isSignedWithPassword, tryUpdateUsername, tryUpdateEmail, tryUpdatePassword, deleteAccount };
