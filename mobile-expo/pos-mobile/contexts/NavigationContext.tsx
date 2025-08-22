import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isInChat: boolean;
  setIsInChat: (inChat: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isInChat, setIsInChat] = useState(false);

  return (
    <NavigationContext.Provider value={{ isInChat, setIsInChat }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
