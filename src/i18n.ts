import i18n from 'i18next'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'

import resources from './locales'
import { Localization } from './locales/languages'

export function getLang() {
  const isBrowser = typeof window !== 'undefined'

  const systemLang = isBrowser
    ? window.navigator.languages
      ? window.navigator.languages[0]
      : window.navigator.language
    : 'en-US'

  const primaryLang = Object.keys(Localization).includes(systemLang)
    ? Localization[systemLang as Localization]
    : Localization.en
  let res = 'en-US'
  const language = isBrowser ? window.localStorage.getItem('locale') || primaryLang : primaryLang
  try {
    const parsedValue = JSON.parse(language)
    if (parsedValue && resources[parsedValue]) res = parsedValue
  } catch {
    if (resources[language]) res = language
  }
  if (isBrowser) window.localStorage.setItem('locale', JSON.stringify(res))
  return {
    language: res,
    systemLang,
  }
}

function setGlobalMomentLocale() {
  const tranlatedDatesObject: {
    [key: string]: string
  } = i18n.t('dates', { returnObjects: true })
  moment.defineLocale(i18n.language, {
    parentLocale: 'en',
    monthsShort: Object.values(tranlatedDatesObject.monthsShort),
    weekdaysShort: Object.values(tranlatedDatesObject.weekdaysShort),
  })
  moment.locale(i18n.language)
}

i18n.use(initReactI18next).init(
  {
    resources,
    lng: getLang().language,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  },
  () => {
    setGlobalMomentLocale()
  },
)

i18n.on('languageChanged', () => {
  setGlobalMomentLocale()
})

export default i18n
