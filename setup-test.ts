export const mockT = jest.fn((str: string): string => str)
import { renderNodes } from './test.helpers'
import '@testing-library/jest-dom'

jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
  useRecoilState: jest.fn(() => ['mock-value', jest.fn()]),
  atom: jest.fn(),
  selector: jest.fn(),
}))

process.env.SESSION_PASSWORD = 'mock-password'

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
