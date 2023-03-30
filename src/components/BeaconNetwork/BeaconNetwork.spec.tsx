import { render, screen } from '@testing-library/react'
import BeaconNetwork from './BeaconNetwork'
import { mockedRecoilValue } from '../../../test.helpers'
import { Network } from '../../constants/enums'

describe('Beacon Network component', () => {
  it('should not render if cannot detect network', () => {
    render(<BeaconNetwork />)

    expect(screen.queryByTestId('beaconNetwork')).not.toBeInTheDocument()
  })

  it('should render correct network text', () => {
    mockedRecoilValue.mockReturnValueOnce(Network.Mainnet)
    render(<BeaconNetwork />)

    expect(screen.getByText('Mainnet')).toBeInTheDocument()
  })
})
