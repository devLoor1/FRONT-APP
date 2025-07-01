import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import CommonStorage from '../storages/common-storage';

interface CommonContextData {
  toogleBalance: () => void;
  showBalance: boolean;
  initialPublicRoute: string;
}

const CommonContext = createContext<CommonContextData>({} as CommonContextData);

export function CommonProvider({ children }: { children: ReactNode }) {
  const [showBalance, setShowBalance] = useState(true);
  const [initialPublicRoute, setInitialPublicRoute] = useState('');

  useEffect(() => {
    (async () => {
      const hide = await CommonStorage.GetHideOnboarding();

      if (hide) {
        setInitialPublicRoute('Login');
      } else {
        setInitialPublicRoute('Onboarding');
      }
    })();
  }, []);

  const toogleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <CommonContext.Provider
      value={{
        toogleBalance,
        showBalance,
        initialPublicRoute,
      }}>
      {children}
    </CommonContext.Provider>
  );
}

export const useCommon = (): CommonContextData => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error('useCommon must be used within a CommonProvider');
  }
  return context;
};
