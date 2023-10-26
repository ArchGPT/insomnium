const BINARY_PREFIX = 'Insomnium.Core';

// NOTE: USE_HARD_LINKS
// https://github.com/electron-userland/electron-builder/issues/4594#issuecomment-574653870

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  npmRebuild: false,
  appId: 'com.insomnium.app',
  protocols: [
    {
      name: 'Insomnium',
      role: 'Viewer',
      schemes: ['insomnia'],
    },
  ],
  files: [
    {
      from: './build',
      to: '.',
      filter: ['**/*', '!opensource-licenses.txt'],
    },
    './package.json',
  ],
  publish: null,
  extraResources: [
    {
      from: './bin',
      to: './bin',
      filter: 'yarn-standalone.js',
    },
    {
      from: './build',
      to: '.',
      filter: 'opensource-licenses.txt',
    },
  ],
  extraMetadata: {
    main: 'main.min.js', // Override the main path in package.json
  },
  fileAssociations: [],
  mac: {
    hardenedRuntime: true,
    category: 'public.app-category.developer-tools',
    entitlements: './build/static/entitlements.mac.inherit.plist',
    entitlementsInherit: './build/static/entitlements.mac.inherit.plist',
    artifactName: `${BINARY_PREFIX}-\${version}.\${ext}`,
    target: [
      {
        target: 'dmg',
        arch: 'universal',
      },
      {
        target: 'zip',
        arch: 'universal',
      },
    ],
    extendInfo: {
      NSRequiresAquaSystemAppearance: false,
    },
    notarize: {
      teamId: 'FX44YY62GV',
    },
    asarUnpack: [
      'node_modules/@getinsomnia/node-libcurl',
    ],
  },
  dmg: {
    window: {
      width: 540,
      height: 380,
    },
    contents: [
      {
        x: 130,
        y: 186,
      },
      {
        x: 409,
        y: 186,
        type: 'link',
        path: '/Applications',
      },
    ],
  },
  win: {
    target: [
      {
        target: 'squirrel',
      },
      {
        target: 'portable',
      },
    ],
  },
  squirrelWindows: {
    artifactName: `${BINARY_PREFIX}-\${version}.\${ext}`,
    iconUrl: 'https://github.com/archGPT/insomnium/blob/main/packages/insomnia/src/icons/icon.png?raw=true',
  },
  portable: {
    artifactName: `${BINARY_PREFIX}-\${version}-portable.\${ext}`,
  },
  linux: {
    artifactName: `${BINARY_PREFIX}-\${version}.\${ext}`,
    executableName: 'insomnia',
    icon: 'src/icons',
    synopsis: 'The Collaborative API Client and Design Tool',
    category: 'Development',
    desktop: {
      Name: 'Insomnium',
      Comment: 'Insomnium is a cross-platform REST client, built on top of Electron.',
      Categories: 'Development',
      Keywords: 'GraphQL;REST;gRPC;SOAP;openAPI;GitOps;',
    },
    target: [
      {
        target: 'AppImage',
      },
      {
        target: 'deb',
      },
      {
        target: 'tar.gz',
      },
      {
        target: 'rpm',
      },
      {
        target: 'snap',
      },
    ],
  },
  snap: {
    base: 'core22',
  },
};

const { env: { BUILD_TARGETS }, platform } = process;
const targets = BUILD_TARGETS?.split(',');
if (platform && targets) {
  console.log('overriding build targets to: ', targets);
  const PLATFORM_MAP = { darwin: 'mac', linux: 'linux', win32: 'win' };
  config[PLATFORM_MAP[platform]].target = config[PLATFORM_MAP[platform]].target.filter(({ target }) => targets.includes(target));
}
module.exports = config;
