import { render, screen } from '@testing-library/react'
import CheckBox from './CheckBox'

describe('CheckBox component', () => {
  it('should render with correct id', () => {
    render(<CheckBox id='test-check-box' />)
    const checkbox = screen.queryByTestId('checkbox')
    expect(checkbox?.id).toBe('test-check-box')
  })
  it('should render with label', () => {
    render(<CheckBox id='test-check-box' label='test label' />)
    expect(screen.queryByTestId('checkbox-label')).toBeInTheDocument()
  })
})
