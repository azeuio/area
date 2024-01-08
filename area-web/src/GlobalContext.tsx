import { Auth, User, getAuth } from 'firebase/auth';
import React from 'react';
import { createContext } from 'react';

type GlobalContextType = {
  readonly backendUrl: string;
  readonly frontendUrl: string;
  readonly navbarHeight: string;
  getUser: () => Promise<User | null>;
  auth: Auth;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const defaultGlobalContext: GlobalContextType = {
  backendUrl: 'http://localhost:8080',
  frontendUrl: window.location.origin,
  navbarHeight: '10vh',
} as GlobalContextType;

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

// export const GlobalContextProvider = GlobalContext.Provider;

// export const GlobalContextConsumer = GlobalContext.Consumer;

// component to be used in the root of the app to get access to global context
export function GlobalContextProvider(props: { children: React.ReactNode }) {
  const auth = getAuth();
  const globalContextValues: GlobalContextType = React.useMemo(() => {
    return {
      ...defaultGlobalContext,
      getUser: async () => {
        return new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          }, reject);
        });
      },
      auth: auth,
    };
  }, [auth]);
  return (
    <GlobalContext.Provider value={globalContextValues}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
