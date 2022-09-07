/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkFull: '#0F0F0F',
        dark950: '#141414',
        dark900: '#212121',
        dark800: '#292929',
        dark750: '#252525',
        dark700: '#303030',
        dark600: '#404040',
        dark500: '#6E6E6E',
        dark400: '#919191',
        dark300: '#ACACAC',
        dark200: '#C8C8C8',
        dark100: '#E1E1E1',
        dark50: '#F1F1F1',
        dark25: '#F8F8F8',
        dark10: '#F0F0F0',
        primary: '#5E41D5',
        darkPrimary: '#1E1E1E',
        borderLight: '#EFEFEF',
        borderDark: '#303030',
        secondary: '#A841D5',
        tertiary: '#D541B8',
        success: '#2ED47A',
        warning: '#FFB800',
        error: '#FF4D00',
      },
      fontFamily: {
        openSauce: ["OpenSauce", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        archivo: ["Archivo", "sans-serif"],
      },
      fontSize: {
        tiny: '8px',
        title: '5.610rem',
        h1: '4.209rem',
        h2: '3.157rem',
        h3: '2.369rem',
        subtitle1: '1.777rem',
        subtitle2: '1.333rem',
        body: '1rem',
        caption1: '.75rem',
        caption2: '.563rem'
      },
      maxWidth: {
        tiny: '165px'
      },
      width: {
        '14.5': '60px',
        '34': '136px',
        '42': '168px'
      },
      translate: {
        '14.5': '60px',
        '42': '168px'
      }
    },
  },
  plugins: [
    require("tailwindcss-scoped-groups")({
      groups: ["sidebar"],
    })
  ],
}
