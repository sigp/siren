import RodalModal from '../RodalModal/RodalModal'
import { useRecoilState } from 'recoil'
import { isBlsExecutionModal } from '../../recoil/atoms'
import useMediaQuery from '../../hooks/useMediaQuery'
import Typography from '../Typography/Typography'
import CodeInput from '../CodeInput/CodeInput'
import ValidatorDisclosure from '../Disclosures/ValidatorDisclosure'
import { useState } from 'react'
import { MOCK_BLS_JSON } from '../../constants/constants'
import GradientHeader from '../GradientHeader/GradientHeader'
import { ButtonFace } from '../Button/Button'

const BlsExecutionModal = () => {
  const [isModal, toggleModal] = useRecoilState(isBlsExecutionModal)
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [blsJson, setJson] = useState(MOCK_BLS_JSON)

  const closeModal = () => toggleModal(false)
  const setJsonValue = (value: string) => setJson(value)

  const showWarning = () => {
    console.log('make execution... ')
  }

  return (
    <RodalModal
      isVisible={isModal}
      styles={{
        width: 'fit-content',
        maxWidth: isTablet ? '448px' : '900px',
        height: isTablet ? '540px' : 'max-content',
      }}
      onClose={closeModal}
    >
      <div>
        <GradientHeader title='BLS to Execution Change ' />
        <div className='p-6 space-y-4'>
          <Typography type='text-caption1'>
            Validator <br /> Management --
          </Typography>
          <Typography className='w-3/4' type='text-caption1'>
            Please enter your BLS Change JSON. Submitting this request will allow the beacon node to
            voluntarily deposit partial rewards and execute validator exits to a designated
            withdrawal address. This action is sensitive, please exercise caution and ensure that
            you have access to your withdrawal address before proceeding. For additional details,
            please follow the link provided.
          </Typography>
          <CodeInput value={blsJson} onChange={setJsonValue} />
        </div>
        {isModal && (
          <div className='p-3 border-t-style100'>
            <ValidatorDisclosure
              isSensitive
              onAccept={showWarning}
              ctaType={ButtonFace.SECONDARY}
              ctaText='Execute Change'
            />
          </div>
        )}
      </div>
    </RodalModal>
  )
}

export default BlsExecutionModal
