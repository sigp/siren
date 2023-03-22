// eslint-disable-next-line no-undef
module.exports = {
  packagerConfig: {
    icon: 'src/assets/images/sigma', // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Siren',
      },
    },
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
