import NetworkErrorModal from './NetworkErrorModal'
import { fireEvent, render, screen } from '@testing-library/react'
import useUiMode from '../../hooks/useUiMode'
import { mockedSetRecoilState, mockedRecoilValue } from '../../../test.helpers'
import { UiMode } from '../../constants/enums'
import clearAllMocks = jest.clearAllMocks

jest.mock('../../hooks/useMediaQuery', () => jest.fn(() => false))
jest.mock('../../hooks/useUiMode', () => jest.fn())

const mockedUseUiMode = useUiMode as jest.MockedFn<typeof useUiMode>
const mockSetRecoilState = jest.fn()

describe('NetworkErrorModal component', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should render validator and beacon error text', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValue(true)
    render(<NetworkErrorModal />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.beaconAndValidator networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
  it('should render Beacon error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValueOnce(true)
    mockedRecoilValue.mockReturnValueOnce(false)
    render(<NetworkErrorModal />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.beaconNode networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
  it('should render Beacon error', () => {
    mockedUseUiMode.mockReturnValue({ mode: UiMode.DARK, toggleUiMode: jest.fn })
    mockedRecoilValue.mockReturnValueOnce(false)
    mockedRecoilValue.mockReturnValueOnce(true)
    render(<NetworkErrorModal />)

    expect(screen.getByTestId('networkText')).toHaveTextContent(
      'networkErrorModal.affectedNetworksnetworkErrorModal.validatorClient networkErrorModal.reconfigureOrContactdiscord.',
    )
  })
  it('config button should set recoil state', () => {
    mockedSetRecoilState.mockReturnValue(mockSetRecoilState)

    render(<NetworkErrorModal />)

    const configBtn = screen.getByTestId('configure')

    fireEvent.click(configBtn)

    expect(mockSetRecoilState).toBeCalled()
  })
})
