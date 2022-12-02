export const mockT = jest.fn((str: string): string => str)
import { renderNodes } from './test.helpers'

jest.mock('i18next', () => ({
  t: mockT,
}))

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  })),
  Trans: ({ i18nKey, children }: any) => {
    return Array.isArray(children)
      ? renderNodes([i18nKey, ...children])
      : renderNodes([i18nKey, children])
  },
}))
