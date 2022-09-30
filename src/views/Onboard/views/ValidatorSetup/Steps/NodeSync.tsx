import { useSetRecoilState } from 'recoil';
import { setupStep } from '../../../../../recoil/atoms';
import { SetupSteps } from '../../../../../constants/enums';
import ValidatorSetupLayout from '../../../../../components/ValidatorSetupLayout/ValidatorSetupLayout';

const NodeSync = () => {
  const setStep = useSetRecoilState(setupStep)

  const viewHealth = () => setStep(SetupSteps.HEALTH)

  return (
    <ValidatorSetupLayout
      onNext={viewHealth}
      onStepBack={viewHealth}
      previousStep="Health Check"
      currentStep="Syncing"
      title="Syncing"
      ctaText="Continue"
    >
      <div>hello</div>
    </ValidatorSetupLayout>
  )
}

export default NodeSync;