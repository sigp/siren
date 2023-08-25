import { render, screen, fireEvent } from '@testing-library/react'
import CurrencySelect from './CurrencySelect'
import { mockedRecoilState, mockedRecoilValue } from '../../../test.helpers'
import { mockCurrencies } from '../../mocks/currencyResults'

const mockSetState = jest.fn()

describe('Currency select component', () => {
  beforeEach(() => {
    mockedRecoilValue.mockReturnValue({ rates: {}, currencies: mockCurrencies })
  })
  it('should render correct list', () => {
    mockedRecoilState.mockReturnValue(['', mockSetState])
    render(<CurrencySelect />)
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.queryByText('EUR')).toBeInTheDocument()
    expect(screen.queryByText('USD')).toBeInTheDocument()
    expect(screen.queryByText('makeSelection')).toBeInTheDocument()
    expect(screen.queryByText('AFN')).not.toBeInTheDocument()
  })
  it('should render selected item and list item', () => {
    mockedRecoilState.mockReturnValue(['USD', mockSetState])
    render(<CurrencySelect />)

    expect(screen.queryAllByText('USD').length).toBe(2)
  })
  it('should call setState and localStorage', () => {
    mockedRecoilState.mockReturnValue(['USD', mockSetState])
    render(<CurrencySelect />)

    fireEvent.click(screen.getByText('EUR'))

    expect(mockSetState).toBeCalled()
    expect(mockSetState).toBeCalledWith('EUR')
  })
})
