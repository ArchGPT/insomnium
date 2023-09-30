import electron from 'electron';
import fs from 'fs';
import path from 'path';
/**** ><> ↑ --------- Importing required modules ->  */

export async function createPlugin(
  moduleName: string,
  version: string,
  mainJs: string,
) {
/**** ><> ↑ --------- Creating a plugin function ->  */
  const pluginDir = path.join(process.env['INSOMNIA_DATA_PATH'] || (process.type === 'renderer' ? window : electron).app.getPath('userData'), 'plugins', moduleName);

  if (fs.existsSync(pluginDir)) {
    throw new Error(`Plugin already exists at "${pluginDir}"`);
  }
  fs.mkdirSync(pluginDir, { recursive: true });
/**** ><> ↑ --------- Preparations for creating a plugin (checking existing plugins, creating plugin directory) ->  */

  // Write package.json
  fs.writeFileSync(
    path.join(pluginDir, 'package.json'),
    JSON.stringify(
      {
        name: moduleName,
        version,
        private: true,
        insomnia: {
          name: moduleName.replace(/^insomnia-plugin-/, ''),
          description: '',
        },
        main: 'main.js',
      },
      null,
      2,
    ),
  );
/**** ><> ↑ --------- Writing package.json ->  */
  // Write main JS file
  fs.writeFileSync(path.join(pluginDir, 'main.js'), mainJs);
/**** ><> ↑ --------- Writing main.js file ->  */
}
/**** ><> ↑ --------- Closing of createPlugin function ->  */
