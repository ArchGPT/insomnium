import React, { createContext, FC, PropsWithChildren, useContext } from 'react';

/**** ><> ↑ --------- Import Statements */
interface Props {
  disable?: boolean;
}
/**** ><> ↑ --------- Interface Definitions */

interface NunjucksEnabledState {
/**** ><> ↑ --------- Context Definition */
  enabled: boolean;
}

const NunjucksEnabledContext = createContext<NunjucksEnabledState | undefined>(undefined);

export const NunjucksEnabledProvider: FC<PropsWithChildren<Props>> = ({ disable, children }) => {
  return (
    <NunjucksEnabledContext.Provider value={{ enabled: !disable }}>
      {children}
    </NunjucksEnabledContext.Provider>
  );
};
/**** ><> ↑ --------- Provider Component */

export const useNunjucksEnabled = () => {
  const context = useContext(NunjucksEnabledContext);

  if (context === undefined) {
    throw new Error('useNunjucksEnabled must be used within a NunjucksEnabledProvider or NunjucksProvider');
  }

  return context;
};
/**** ><> ↑ --------- Custom Hook */
