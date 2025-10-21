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
        'networkErrorModal.retryingConnection': 'Retrying connection...',
        'networkErrorModal.automaticRecovery':
          'Siren will automatically reconnect when services become available.',
        'networkErrorModal.waitingForReconnection': 'Waiting for reconnection to be established...',
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
          Please review and update configuration settings. If this issue persists please contact our
          team in {DiscordLink}.
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

    expect(screen.getByText(/Beacon Node and Validator Client/i)).toBeInTheDocument()
    expect(screen.getByText('Beacon Node')).toBeInTheDocument()
    expect(screen.getByText('Validator Client')).toBeInTheDocument()
    expect(screen.getAllByText('Connection lost - retrying...').length).toBe(2)
    expect(screen.getByText(/Waiting for reconnection to be established/i)).toBeInTheDocument()
  })

  it('should render Beacon error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn() })
    render(<NetworkErrorModal isBeaconNetworkError isValidatorNetworkError={false} />)

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent === 'Beacon Node' && element?.className.includes('font-semibold')
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Connection lost - retrying...')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('should render Validator error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn() })
    render(<NetworkErrorModal isValidatorNetworkError isBeaconNetworkError={false} />)

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent === 'Validator Client' &&
          element?.className.includes('font-semibold')
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Connection lost - retrying...')).toBeInTheDocument()
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })
})
