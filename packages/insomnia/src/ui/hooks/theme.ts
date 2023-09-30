import { ChangeEvent, useCallback, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useAsync } from 'react-use';
/**** ><> ↑ --------- Import necessary modules from 'react', 'react-router-dom', and 'react-use' ->  */

import { ThemeSettings } from '../../models/settings';
import { ColorScheme, getThemes } from '../../plugins';
import { applyColorScheme, PluginTheme } from '../../plugins/misc';
import { RootLoaderData } from '../routes/root';
import { useSettingsPatcher } from './use-request';
/**** ><> ↑ --------- Import project-specific modules ->  */

export const useThemes = () => {
  const {
    settings,
  } = useRouteLoaderData('root') as RootLoaderData;
  const {
    lightTheme,
    darkTheme,
    autoDetectColorScheme,
    theme,
    pluginConfig,
  } = settings;

  const [themes, setThemes] = useState<PluginTheme[]>([]);
/**** ><> ↑ --------- In 'useThemes' function, define local state and its setter function ->  */

  useAsync(async () => {
    const pluginThemes = await getThemes();
    setThemes(pluginThemes.map(({ theme }) => theme));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Reload themes if pluginConfig changes
  }, [pluginConfig]);
/**** ><> ↑ --------- In 'useThemes' function, load themes asynchronously and set to local state ->  */

  // Check if the theme is active
  const isActiveDark = useCallback(({ name }: PluginTheme) => name === darkTheme, [darkTheme]);
  const isActiveLight = useCallback(({ name }: PluginTheme) => name === lightTheme, [lightTheme]);
/**** ><> ↑ --------- In 'useThemes' function, define theme-checker callback functions ->  */

  const isActive = useCallback((pluginTheme : PluginTheme) => {
    if (autoDetectColorScheme) {
      return isActiveLight(pluginTheme) || isActiveDark(pluginTheme);
    }
    return pluginTheme.name === theme;
  }, [autoDetectColorScheme, isActiveDark, isActiveLight, theme]);
/**** ><> ↑ --------- In 'useThemes' function, define theme-checker callback function depending on auto-detection ->  */
  const patchSettings = useSettingsPatcher();
/**** ><> ↑ --------- In 'useThemes' function, define settings patcher ->  */

  // Apply the theme and update settings
  const apply = useCallback(async (patch: Partial<ThemeSettings>) => {
    applyColorScheme({
      theme,
      autoDetectColorScheme,
      darkTheme,
      lightTheme,
      ...patch,
    });
    patchSettings(patch);

  }, [autoDetectColorScheme, darkTheme, lightTheme, patchSettings, theme]);
/**** ><> ↑ --------- In 'useThemes' function, define apply callback to apply theme and update settings ->  */

  const changeAutoDetect = useCallback(({ target: { checked } }: ChangeEvent<HTMLInputElement>) => apply({ autoDetectColorScheme: checked }), [apply]);
/**** ><> ↑ --------- In 'useThemes' function, define callback to change auto-detection property ->  */

  // Activate the theme for the selected color scheme
  const activate = useCallback(async (themeName: string, colorScheme: ColorScheme) => {
    switch (colorScheme) {
      case 'light':
        await apply({ lightTheme: themeName });
        break;

      case 'dark':
        await apply({ darkTheme: themeName });
        break;

      case 'default':
        await apply({ theme: themeName });
        break;

      default:
        throw new Error(colorScheme);
    }
  }, [apply]);
/**** ><> ↑ --------- In 'useThemes' function, define callback to activate the theme ->  */

  return {
    themes,
    isActive,
    isActiveLight,
    isActiveDark,
    activate,
    changeAutoDetect,
    autoDetectColorScheme,
  };
/**** ><> ↑ --------- Define 'useThemes' function ->  */
};
/**** ><> ↑ --------- In 'useThemes' function, return object with various properties ->  */
