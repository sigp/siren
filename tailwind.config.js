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
        transWhite: '#FFFFFF98',
        primary50: '#FFF5FF',
        primary100: '#CCAFFF',
        primary200: '#7C5FEB',
        primary: '#5E41D5',
        primaryBright: '#5200FF',
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
        subtitle3: '1.125rem',
        body: '1rem',
        caption1: '.75rem',
        caption2: '.563rem'
      },
      minHeight: {
        '60': '15rem'
      },
      maxHeight: {
        '30': '7.313rem',
        '32': '8.313rem',
        '60.5': '15.063rem'
      },
      minWidth: {
        '316': '316px',
      },
      maxWidth: {
        tiny: '165px',
        '316': '316px',
        '238': '238px',
        'tr-11': '111px',
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
