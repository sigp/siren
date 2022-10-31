/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
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
        primary80: 'rgba(255, 255, 255, 0.8)',
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
      backgroundImage: {
        'lighthouse': 'url(\'./assets/images/lightHouseBg.png\')',
      },
      fontFamily: {
        openSauce: ['OpenSauce', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
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
        '60.5': '15.063rem',
        '396': '24.75rem'
      },
      minWidth: {
        '316': '316px',
      },
      maxWidth: {
        tiny: '165px',
        '316': '316px',
        '238': '238px',
        'tr-11': '111px',
        '1142': '1142px',
        '1440': '1440px'
      },
      width: {
        '14.5': '60px',
        '34': '136px',
        '42': '168px',
        '9/10': '90%',
      },
      height: {
        '22': '5.688rem',
        '11/20': '55%'
      },
      inset: {
        35: '35%',
        40: '40%',
        45: '45%',
      },
      keyframes: {
        blink: {
          '0%': {opacity: '100%'},
          '50%': {opacity: '100%'},
          '100%': {opacity: '0%'}
        },
        fadeSlideIn: {
          '0%': {
            opacity: '0%',
            transform: 'translateY(-5%);'
          },
          '100%': {
            opacity: '100%',
            transform: 'translateY(0);'
          }
        }
      },
      animation: {
        'spin-slow': 'spin 240s linear infinite',
        'blink': 'blink 1s linear infinite',
        fadeSlideIn: 'fadeSlideIn 150ms ease-in',
      },
      translate: {
        '14.5': '60px',
        '42': '168px',
        'toggleWidth': '3rem'
      },
      screens: {
        '@1440': '1440px',
        '@1024': '1024px',
        '@1200': '1200px',
        '@1600': '1600px'
      }
    },
  },
  plugins: [
    require('tailwindcss-scoped-groups')({
      groups: ['sidebar'],
    })
  ],
}
