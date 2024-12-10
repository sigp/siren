import { render, screen } from '@testing-library/react'
import React from 'react'
import { UiMode } from '../../constants/enums'
import useUiMode from '../../hooks/useUiMode'
import NetworkErrorModal from './NetworkErrorModal'

jest.mock('../../hooks/useMediaQuery', () => jest.fn(() => false))
jest.mock('../../hooks/useUiMode', () => jest.fn())

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'networkErrorModal.title': 'Network Error',
        'networkErrorModal.beaconAndValidator': 'Beacon Node and Validator Client',
        'networkErrorModal.beaconNode': 'Beacon Node',
        'networkErrorModal.validatorClient': 'Validator Client',
      }
      return translations[key] || key
    },
  }),
  Trans: ({ i18nKey, values = {}, components = {}, children }: any) => {
    const translations: Record<string, string> = {
      'networkErrorModal.affectedNetworks':
        'Siren failed to maintain connection to the designated <span>{{network}}</span>. ',
      'networkErrorModal.reconfigureOrContact':
        'Please review and update configuration settings. If this issue persists please contact our team in <0>discord</0>.',
    }

    if (i18nKey === 'networkErrorModal.affectedNetworks') {
      const network = values.network
      const SpanElement = components.span
      return (
        <>
          Siren failed to maintain connection to the designated{' '}
          {React.cloneElement(SpanElement, {}, network)}.
        </>
      )
    }

    if (i18nKey === 'networkErrorModal.reconfigureOrContact') {
      const DiscordLink = React.Children.toArray(children)[0]
      return (
        <>
          Please review and update configuration settings. If this issue persists please contact our team in{' '}
          {DiscordLink}.
        </>
      )
    }

    return <>{translations[i18nKey] || i18nKey}</>
  },
}))

const mockedUseUiMode = useUiMode as jest.MockedFunction<typeof useUiMode>

describe('NetworkErrorModal component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render validator and beacon error text', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn() })
    render(<NetworkErrorModal isValidatorNetworkError isBeaconNetworkError />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'Siren failed to maintain connection to the designated Beacon Node and Validator Client.Please review and update configuration settings. If this issue persists please contact our team in discord.',
    )
  })

  it('should render Beacon error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn() })
    render(<NetworkErrorModal isBeaconNetworkError isValidatorNetworkError={false} />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'Siren failed to maintain connection to the designated Beacon Node.Please review and update configuration settings. If this issue persists please contact our team in discord.',
    )
  })

  it('should render Validator error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn() })
    render(<NetworkErrorModal isValidatorNetworkError isBeaconNetworkError={false} />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'Siren failed to maintain connection to the designated Validator Client.Please review and update configuration settings. If this issue persists please contact our team in discord.',
    )
  })
})
