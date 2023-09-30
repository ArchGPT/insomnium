import { useEffect } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
/**** ><> ↑ --------- Module imports ->  */

import * as themes from '../../plugins/misc';
import { RootLoaderData } from '../routes/root';
/**** ><> ↑ --------- Local imports ->  */

export const useThemeChange = () => {
  const {
    settings,
  } = useRouteLoaderData('root') as RootLoaderData;
/**** ><> ↑ --------- Function definition and hook setup ->  */
  // Handle System Theme change
  useEffect(() => {
    const matches = window.matchMedia('(prefers-color-scheme: dark)');
    matches.addEventListener('change', () => themes.applyColorScheme(settings));
    return () => {
      matches.removeEventListener('change', () => themes.applyColorScheme(settings));
    };
  });
};
/**** ><> ↑ --------- Handling system theme change ->  */
