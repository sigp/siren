import resources from './index'

export enum Localization {
  en = 'en-US',
  'en-US' = 'en-US',
  'es-ES' = 'es-ES',
}

export const MENU_MAP: any = {
  'en-US': { value: 'American English', text: 'English' },
  'es-ES': { value: 'Español', text: 'Spanish (Español de España)' },
}

export const languages = Object.keys(resources).reduce((result: any, languageKey: string) => {
  if (MENU_MAP[languageKey] === undefined) return result

  return {
    ...result,
    [languageKey]: MENU_MAP[languageKey],
  }
}, {})
