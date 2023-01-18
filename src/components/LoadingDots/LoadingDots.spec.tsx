import { render, screen } from '@testing-library/react'
import LoadingDots from './LoadingDots'

describe('loading dots component', () => {
  it('should render with default classes', () => {
    render(<LoadingDots />)
    expect(screen.queryAllByTestId('dot').length).toBe(3)
  })
  it('should render with additional classes', () => {
    render(<LoadingDots className='extraClass' />)
    expect(screen.getByTestId('container').className).toContain('extraClass')
  })
})
