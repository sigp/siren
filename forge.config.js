// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
require('dotenv').config()

// eslint-disable-next-line no-undef
module.exports = {
  packagerConfig: {
    icon: 'src/assets/images/sigma', // no file extension required
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      // eslint-disable-next-line no-undef
      appleId: process.env.APPLE_ID,
      // eslint-disable-next-line no-undef
      appleIdPassword: process.env.APPLE_PASSWORD,
      // eslint-disable-next-line no-undef
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'mas', 'win32', 'linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
      },
    },
  ],
}
