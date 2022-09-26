import { useState } from 'react'
import HealthCheck from './Steps/HealthCheck'

const ValidatorSetup = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, _setView] = useState('')

  switch (view) {
    default:
      return <HealthCheck />
  }
}

export default ValidatorSetup
