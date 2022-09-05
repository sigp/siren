import '../src/global.css';
import { themes } from '@storybook/theming'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    dark: {
      ...themes.dark,          // copy existing values
      appContentBg: '#1E1E1E', // override main story view frame
      barBg: '#202020'         // override top toolbar
    }
  }
}

export const globalTypes = {
  darkMode: true,
};