import { ValidatorStatus } from '../src/types/validator'

const getValidatorStatusStage = (status: ValidatorStatus): number => {
  switch (true) {
    case status.includes('exit'):
    case status.includes('withdrawal'):
      return 4
    case status.includes('active'):
      return 3
    case status.includes('pending'):
      return 2
    default:
      return 1
  }
}

export default getValidatorStatusStage
