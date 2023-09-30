import { FC, useEffect } from 'react';

import { useGlobalKeyboardShortcuts } from '../hooks/use-global-keyboard-shortcuts';
import { useSettingsSideEffects } from '../hooks/use-settings-side-effects';
import { useSyncMigration } from '../hooks/use-sync-migration';
import { useThemeChange } from '../hooks/use-theme-change';
/**** ><> ↑ --------- Importing modules and hooks ->  */

export const AppHooks: FC = () => {
/**** ><> ↑ --------- Function definition ->  */
  useSyncMigration();
  useSettingsSideEffects();
  useGlobalKeyboardShortcuts();
  useThemeChange();
/**** ><> ↑ --------- Hooks invocations ->  */
  // Used for detecting if we just updated Insomnium and app --args or insomnia:// and
  useEffect(() => {
    setTimeout(() => window.main.halfSecondAfterAppStart(), 500);
  }, []);
/**** ><> ↑ --------- Effect execution after component mount ->  */

  return null;
/**** ><> ↑ --------- Component return statement ->  */
};
/**** ><> ↑ --------- Function closing bracket ->  */
