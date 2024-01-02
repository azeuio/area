import { Auth, User, getAuth } from 'firebase/auth';
import React from 'react';
import { createContext } from 'react';

type GlobalContextType = {
  readonly backendUrl: string;
  readonly frontendUrl: string;
  readonly navbarHeight: string;
  // user, setUser refs
  user: User | null;
  auth: Auth;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const defaultGlobalContext: GlobalContextType = {
  backendUrl: 'http://127.0.0.1:8080',
  frontendUrl: window.location.origin,
  navbarHeight: '10vh',
} as GlobalContextType;

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

// export const GlobalContextProvider = GlobalContext.Provider;

// export const GlobalContextConsumer = GlobalContext.Consumer;

// component to be used in the root of the app to get access to global context
export function GlobalContextProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const auth = getAuth();
  const globalContextValues: GlobalContextType = {
    ...defaultGlobalContext,
    user: user,
    setUser: setUser,
    auth: auth,
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <GlobalContext.Provider value={globalContextValues}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
